const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testUserSyncAndCompletion() {
  console.log("=== Testing User Sync + Step Completion Flow ===");

  // 1. Get auth users from Supabase Auth schema
  const { data: { users: authUsers }, error: aErr } = await supabaseAdmin.auth.admin.listUsers();

  if (aErr || !authUsers || authUsers.length === 0) {
    console.log("No Auth users found via admin API");
    return;
  }

  const testAuthUser = authUsers[0];
  console.log(`Found Auth User: ${testAuthUser.email} (ID: ${testAuthUser.id})`);

  // 2. Sync user into public.users
  const { data: userSync, error: syncErr } = await supabaseAdmin
    .from("users")
    .upsert({
      id: testAuthUser.id,
      email: testAuthUser.email,
      full_name: testAuthUser.user_metadata?.full_name || testAuthUser.email.split("@")[0],
      role: "learner"
    })
    .select();

  if (syncErr) {
    console.error("❌ User Sync Failed:", syncErr);
    return;
  }
  console.log("✅ User Synced into public.users successfully!");

  // 3. Get a test step
  const { data: steps } = await supabaseAdmin.from("steps").select("id, title").limit(1);
  if (!steps || steps.length === 0) return;
  const testStep = steps[0];

  // 4. Test learner_progress insert
  const { data: progData, error: progErr } = await supabaseAdmin
    .from("learner_progress")
    .upsert({
      user_id: testAuthUser.id,
      step_id: testStep.id
    }, { onConflict: "user_id,step_id" })
    .select();

  if (progErr) {
    console.error("❌ Step Progress Insert Failed:", progErr);
  } else {
    console.log("🎉 STEP MARK DONE SUCCESSFUL!", progData);
  }
}

testUserSyncAndCompletion();
