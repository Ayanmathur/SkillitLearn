const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function debugStepCompletion() {
  console.log("=== Testing Step Completion Logic ===");

  // Get a test user
  const { data: users, error: uErr } = await supabaseAdmin.from("users").select("id, email").limit(1);
  if (!users || users.length === 0) {
    console.error("No users found in DB!");
    return;
  }
  const testUser = users[0];
  console.log("Test User:", testUser.email, "(ID:", testUser.id, ")");

  // Get a test step
  const { data: steps, error: sErr } = await supabaseAdmin.from("steps").select("id, title").limit(1);
  if (!steps || steps.length === 0) {
    console.error("No steps found in DB!");
    return;
  }
  const testStep = steps[0];
  console.log("Test Step:", testStep.title, "(ID:", testStep.id, ")");

  // Test 1: Direct insert via Supabase Admin (bypasses RLS)
  console.log("\nAttempting Supabase Admin Insert into learner_progress...");
  const { data: insData, error: insErr } = await supabaseAdmin
    .from("learner_progress")
    .upsert({
      user_id: testUser.id,
      step_id: testStep.id,
    }, { onConflict: "user_id,step_id" })
    .select();

  if (insErr) {
    console.error("❌ Supabase Admin Upsert Failed:", insErr);
  } else {
    console.log("🎉 Supabase Admin Upsert Succeeded!", insData);
  }
}

debugStepCompletion();
