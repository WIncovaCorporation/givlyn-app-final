const fs = require('fs');
const https = require('https');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Leer el SQL migration
const sqlContent = fs.readFileSync('supabase/migrations/003_monetization_tables.sql', 'utf8');

// Split SQL en statements individuales
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📊 Ejecutando ${statements.length} SQL statements...`);

let completed = 0;
let errors = [];

// Función para ejecutar SQL via PostgREST
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql + ';' });
    
    const options = {
      hostname: SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: '/rest/v1/rpc/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, status: res.statusCode });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

// Ejecutar statements secuencialmente
(async () => {
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
    
    try {
      console.log(`[${i + 1}/${statements.length}] ${preview}...`);
      const result = await executeSQL(stmt);
      
      if (result.success) {
        completed++;
      } else {
        errors.push({ stmt: preview, error: result.error });
        console.error(`  ❌ Error:`, result.error);
      }
    } catch (err) {
      errors.push({ stmt: preview, error: err.message });
      console.error(`  ❌ Exception:`, err.message);
    }
  }

  console.log(`\n✅ Completado: ${completed}/${statements.length}`);
  if (errors.length > 0) {
    console.log(`❌ Errores: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e.stmt}: ${e.error}`));
  }
})();
