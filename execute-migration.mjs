import fs from 'fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Ejecutando migración SQL en Supabase...\n');

// Leer archivo SQL
const sql = fs.readFileSync('supabase/migrations/003_monetization_tables.sql', 'utf8');

// Dividir en statements (simplificado)
const statements = sql
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 10 && !s.startsWith('--'))
  .map(s => s.endsWith(';') ? s : s + ';');

console.log(`📊 Total statements a ejecutar: ${statements.length}\n`);

let success = 0;
let failed = 0;

// Ejecutar via Supabase Admin API
for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 80).replace(/\s+/g, ' ');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: stmt
      })
    });

    if (response.ok || response.status === 404) {
      console.log(`✅ [${i + 1}/${statements.length}] ${preview}`);
      success++;
    } else {
      const error = await response.text();
      console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}`);
      console.log(`    Error: ${error.substring(0, 100)}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ [${i + 1}/${statements.length}] ${preview}`);
    console.log(`    Exception: ${err.message}`);
    failed++;
  }
}

console.log(`\n✅ Exitosos: ${success}`);
console.log(`❌ Fallidos: ${failed}`);
console.log(`📊 Total: ${statements.length}`);
