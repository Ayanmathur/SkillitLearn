const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function scanAllTables() {
  console.log("=== Comprehensive Table Scan in Supabase ===");

  const candidates = [
    'users', 'profiles', 'learner_progress', 'user_progress', 'step_progress',
    'step_completions', 'user_steps', 'user_skills', 'skill_completion',
    'skill_completions', 'quiz_attempts', 'quiz_results', 'attempts', 'certificates',
    'path_certificates', 'path_certificate_templates'
  ];

  for (const name of candidates) {
    const { data, error } = await supabaseAdmin.from(name).select('*').limit(1);
    if (!error) {
      console.log(`✅ Table EXISTS: '${name}'`);
    } else {
      console.log(`❌ Table missing: '${name}' (${error.code})`);
    }
  }
}

scanAllTables();
