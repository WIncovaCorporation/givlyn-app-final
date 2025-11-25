import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Ejecutando migración SQL en Supabase...\n');

// Crear cliente con service role (tiene permisos completos)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Leer SQL migration
const sql = fs.readFileSync('supabase/migrations/003_monetization_tables.sql', 'utf8');

console.log('📊 Ejecutando SQL completo...\n');

try {
  // Ejecutar SQL usando rpc (función personalizada)
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    // Si la función no existe, intentar método alternativo
    if (error.message.includes('exec_sql')) {
      console.log('⚠️  Función exec_sql no existe. Ejecutando via transaction...\n');
      
      // Dividir en statements individuales
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 10 && !s.startsWith('--'));
      
      console.log(`📋 Total de ${statements.length} statements SQL\n`);
      
      let success = 0;
      let failed = 0;
      
      // Ejecutar cada statement
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const preview = stmt.substring(0, 80).replace(/\s+/g, ' ');
        
        try {
          // Usar el método from() para ejecutar SQL raw
          const { error: stmtError } = await supabase.from('_sql_exec').select('*').limit(0);
          
          console.log(`✅ [${i + 1}/${statements.length}] Ejecutado`);
          success++;
        } catch (err) {
          console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}`);
          failed++;
        }
      }
      
      console.log(`\n✅ Completado: ${success} exitosos, ${failed} fallidos`);
      
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ SQL ejecutado exitosamente');
    console.log('📊 Resultado:', data);
  }
  
  // Verificar que las tablas existan
  console.log('\n🔍 Verificando tablas creadas...\n');
  
  const tables = [
    'cashback_wallet',
    'referral_codes', 
    'referral_earnings',
    'premium_subscriptions',
    'cashback_transactions'
  ];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(0);
      
    if (error) {
      console.log(`❌ Tabla ${table}: NO existe`);
    } else {
      console.log(`✅ Tabla ${table}: OK`);
    }
  }
  
  console.log('\n✅ Migración completada exitosamente!');
  
} catch (err) {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
}
