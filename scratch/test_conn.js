const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testSupabaseRestProgress() {
  console.log("=== Testing Supabase Admin REST Insert ===");

  // 1. Sync User using Service Role Key
  const { data: userData, error: userErr } = await supabaseAdmin
    .from("users")
    .upsert({
      id: "e271910c-c986-4765-999e-c86da7f4bd5f",
      email: "maymathew325@gmail.com",
      full_name: "May Mathew",
      role: "learner"
    })
    .select();

  if (userErr) {
    console.error("❌ User Sync Error:", userErr);
  } else {
    console.log("✅ User Synced via Admin REST:", userData);
  }
}

testSupabaseRestProgress();
