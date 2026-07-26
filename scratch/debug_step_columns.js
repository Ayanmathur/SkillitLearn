const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkStepColumns() {
  console.log("=== Checking Steps table structure in Supabase ===");

  const { data: step, error } = await supabase
    .from("steps")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Steps select error:", error);
    return;
  }

  console.log("Sample Step keys:", Object.keys(step[0] || {}));
  console.log("Sample Step data:", step[0]);
}

checkStepColumns();
