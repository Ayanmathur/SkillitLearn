const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testLearnerProgressREST() {
  console.log("=== Testing learner_progress REST Upsert ===");

  const userId = "e271910c-c986-4765-999e-c86da7f4bd5f";
  const stepId = "d2d98ec3-87ff-4e01-83da-4a5c9a1d8444";

  // Upsert into learner_progress using admin client
  const { data, error } = await supabaseAdmin
    .from("learner_progress")
    .upsert({
      user_id: userId,
      step_id: stepId
    }, { onConflict: "user_id,step_id" })
    .select();

  if (error) {
    console.error("❌ REST Upsert Error:", error);
  } else {
    console.log("🎉 SUCCESS! learner_progress row:", data);
  }
}

testLearnerProgressREST();
