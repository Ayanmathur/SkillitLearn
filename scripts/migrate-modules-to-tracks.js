const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkDatabaseSchema() {
  console.log("=== Checking Supabase Table Structure ===");

  // Check if "tracks" table exists
  const { data: tracksData, error: tracksErr } = await supabase
    .from("tracks")
    .select("id")
    .limit(1);

  if (!tracksErr) {
    console.log("✅ 'tracks' table ALREADY exists in Supabase!");
  } else {
    console.log("⚠️ 'tracks' table not found yet. Status:", tracksErr.code);
  }

  // Check if "modules" table exists
  const { data: modulesData, error: modulesErr } = await supabase
    .from("modules")
    .select("id")
    .limit(1);

  if (!modulesErr) {
    console.log("ℹ️ 'modules' table currently exists in Supabase.");
  }
}

checkDatabaseSchema();
