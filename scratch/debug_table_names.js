const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function findTables() {
  const possibleNames = ['modules', 'tracks', 'skill_modules', 'learning_tracks', 'steps', 'skill_steps'];

  for (const name of possibleNames) {
    const { data, error } = await supabase.from(name).select('*').limit(1);
    if (!error) {
      console.log(`✅ Table EXITS: '${name}' (count: ${data?.length})`);
    } else {
      console.log(`❌ Table missing: '${name}' (${error.code})`);
    }
  }
}

findTables();
