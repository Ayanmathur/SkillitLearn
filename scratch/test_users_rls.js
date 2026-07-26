const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testUsersTable() {
  console.log("=== Testing Users Table Access ===");

  // Test 1: Can we query users table at all with anon key?
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .limit(1);

  if (error) {
    console.error("❌ Users table query FAILED:", error.code, error.message);
    console.log("This means RLS is blocking anon access to users table!");
    console.log("getCurrentUser() will ALWAYS return null even for logged-in users.");
  } else {
    console.log("✅ Users table accessible. Row count:", data?.length);
    if (data && data[0]) console.log("First user:", data[0]);
  }
}

testUsersTable();
