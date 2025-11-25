import express from 'express';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());

// Validar token al inicio
const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) {
  console.error('❌ GITHUB_TOKEN no configurado. Backup deshabilitado.');
} else {
  console.log('✅ GITHUB_TOKEN configurado. Backup habilitado.');
}

// Archivos y directorios a ignorar
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.cache',  // Cache de Bun/npm
  '.replit',
  'replit.nix',
  '.gitignore',
  'backup-server.js',
  'backup.sh',
  '.env',
  '.env.local',
  '.config',  // Configuraciones temporales
  'tmp',
  '.tmp'
];

// Extensiones binarias
const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp',
  '.pdf', '.zip', '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.webm', '.mp3', '.wav', '.lockb'
];

function isBinaryFile(filePath) {
  return BINARY_EXTENSIONS.some(ext => filePath.toLowerCase().endsWith(ext));
}

async function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (await shouldIgnore(relativePath)) continue;

    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

// Calcular Git blob SHA (compatible con GitHub)
function calculateGitBlobSha(content, encoding = 'utf-8') {
  let buffer;
  if (encoding === 'base64') {
    buffer = Buffer.from(content, 'base64');
  } else {
    buffer = Buffer.from(content, 'utf-8');
  }
  
  const header = `blob ${buffer.length}\0`;
  const store = Buffer.concat([Buffer.from(header), buffer]);
  return crypto.createHash('sha1').update(store).digest('hex');
}

// Retry con exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⚠️ Reintentando en ${delay}ms... (intento ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

app.post('/api/backup', async (req, res) => {
  try {
    if (!githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GITHUB_TOKEN no configurado'
      });
    }

    console.log('🔄 Iniciando respaldo INCREMENTAL a GitHub...');

    const octokit = new Octokit({ auth: githubToken });
    const owner = 'WIncovaCorporation';
    const repo = 'wishful-secret-gift';
    const branch = 'main';

    // 1. Obtener la referencia actual de main
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });
    const currentCommitSha = refData.object.sha;

    // 2. Obtener el commit actual
    const { data: currentCommit } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: currentCommitSha
    });

    // 3. Obtener el árbol remoto completo (NUEVO: para comparar)
    console.log('📥 Obteniendo árbol remoto de GitHub...');
    const { data: remoteTree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: currentCommit.tree.sha,
      recursive: 'true'
    });

    // Crear mapa de archivos remotos: path -> sha
    const remoteFiles = new Map();
    remoteTree.tree.forEach(item => {
      if (item.type === 'blob') {
        remoteFiles.set(item.path, item.sha);
      }
    });

    // 4. Leer todos los archivos locales
    const files = await getAllFiles(__dirname);
    const treeEntries = [];
    let newBlobsCreated = 0;
    let filesReused = 0;
    let filesModified = 0;

    console.log(`📊 Total archivos locales: ${files.length}`);
    console.log(`📊 Total archivos remotos: ${remoteFiles.size}`);

    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const isBinary = isBinaryFile(file);
      
      let content, encoding;
      if (isBinary) {
        content = await fs.readFile(filePath, 'base64');
        encoding = 'base64';
      } else {
        content = await fs.readFile(filePath, 'utf-8');
        encoding = 'utf-8';
      }

      // Calcular SHA local del archivo
      const localSha = calculateGitBlobSha(content, encoding);
      const remoteSha = remoteFiles.get(file);

      let blobSha;

      if (remoteSha === localSha) {
        // Archivo NO cambió → Reutilizar SHA remoto
        blobSha = remoteSha;
        filesReused++;
      } else {
        // Archivo NUEVO o MODIFICADO → Crear blob con retry
        try {
          const { data: blob } = await retryWithBackoff(async () => {
            return await octokit.git.createBlob({
              owner,
              repo,
              content,
              encoding
            });
          });
          blobSha = blob.sha;
          newBlobsCreated++;
          
          if (remoteSha) {
            console.log(`✏️ Modificado: ${file}`);
            filesModified++;
          } else {
            console.log(`➕ Nuevo: ${file}`);
          }
        } catch (error) {
          console.error(`❌ Error creando blob para ${file}:`, error.message);
          // Si falla, usar SHA remoto si existe, o skip
          if (remoteSha) {
            blobSha = remoteSha;
          } else {
            continue; // Skip archivo si no se puede crear blob
          }
        }
      }
      
      treeEntries.push({
        path: file,
        mode: '100644',
        type: 'blob',
        sha: blobSha
      });
    }

    if (treeEntries.length === 0) {
      return res.json({
        success: false,
        message: 'No hay archivos para respaldar'
      });
    }

    console.log(`✅ Archivos sin cambios (reutilizados): ${filesReused}`);
    console.log(`✅ Archivos modificados: ${filesModified}`);
    console.log(`✅ Archivos nuevos: ${newBlobsCreated - filesModified}`);
    console.log(`✅ Blobs creados en GitHub API: ${newBlobsCreated} (vs ${files.length} en versión anterior)`);

    // Si no hay cambios, no hacer commit
    if (newBlobsCreated === 0) {
      console.log('ℹ️ No hay cambios para commitear');
      return res.json({
        success: true,
        message: 'No hay cambios para respaldar',
        filesChecked: files.length,
        filesReused: filesReused
      });
    }

    // 5. Crear un nuevo árbol
    const { data: newTree } = await retryWithBackoff(async () => {
      return await octokit.git.createTree({
        owner,
        repo,
        tree: treeEntries,
        base_tree: currentCommit.tree.sha
      });
    });

    // 6. Crear un nuevo commit
    const timestamp = new Date().toLocaleString('es-ES');
    const { data: newCommit } = await retryWithBackoff(async () => {
      return await octokit.git.createCommit({
        owner,
        repo,
        message: `🤖 Backup incremental - ${timestamp}\n\n✏️ Modificados: ${filesModified}\n➕ Nuevos: ${newBlobsCreated - filesModified}`,
        tree: newTree.sha,
        parents: [currentCommitSha]
      });
    });

    // 7. Actualizar la referencia
    await retryWithBackoff(async () => {
      return await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommit.sha
      });
    });

    console.log('✅ Respaldo completado exitosamente:', newCommit.sha.substring(0, 7));
    console.log(`📊 Eficiencia: ${((filesReused / files.length) * 100).toFixed(1)}% archivos reutilizados`);
    
    res.json({
      success: true,
      message: 'Respaldo incremental completado',
      commit: newCommit.sha.substring(0, 7),
      stats: {
        totalFiles: files.length,
        filesReused: filesReused,
        filesModified: filesModified,
        filesNew: newBlobsCreated - filesModified,
        apiCallsSaved: filesReused,
        efficiency: `${((filesReused / files.length) * 100).toFixed(1)}%`
      }
    });

  } catch (error) {
    console.error('❌ Error en backup:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al ejecutar backup',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔧 Servidor de backup corriendo en puerto ${PORT}`);
});
