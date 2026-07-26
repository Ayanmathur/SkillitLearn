const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkBothTables() {
  console.log("=== Checking 'modules' vs 'tracks' in Supabase ===");

  const { data: modData, error: modErr } = await supabase.from("modules").select("id").limit(1);
  console.log("From 'modules':", modData ? `Found ${modData.length} row` : modErr.message);

  const { data: trkData, error: trkErr } = await supabase.from("tracks").select("id").limit(1);
  console.log("From 'tracks':", trkData ? `Found ${trkData.length} row` : trkErr.message);
}

checkBothTables();
