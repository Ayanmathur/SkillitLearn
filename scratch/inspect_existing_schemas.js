const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function inspectExistingTables() {
  console.log("=== Inspecting Existing Tables in Supabase ===");

  const tables = ['users', 'certificates', 'path_certificate_templates', 'steps'];

  for (const t of tables) {
    const { data, error } = await supabaseAdmin.from(t).select('*').limit(1);
    if (!error && data && data.length > 0) {
      console.log(`\nTable '${t}' columns:`, Object.keys(data[0]));
    } else {
      console.log(`Table '${t}' query error or empty:`, error?.message || 'Empty');
    }
  }
}

inspectExistingTables();
