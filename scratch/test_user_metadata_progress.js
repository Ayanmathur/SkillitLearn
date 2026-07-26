const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testUserMetadataProgress() {
  console.log("=== Testing User Metadata Progress Persistence ===");

  const testUserId = "e271910c-c986-4765-999e-c86da7f4bd5f"; // maymathew325@gmail.com
  const testStepId = "d2d98ec3-87ff-4e01-83da-4a5c9a1d8444";

  // 1. Get current user metadata
  const { data: { user }, error: getErr } = await supabaseAdmin.auth.admin.getUserById(testUserId);
  if (getErr || !user) {
    console.error("Failed to get user:", getErr);
    return;
  }

  console.log("Current user metadata:", user.user_metadata);

  const existingCompleted = user.user_metadata?.completed_step_ids || [];
  const updatedCompleted = Array.from(new Set([...existingCompleted, testStepId]));

  // 2. Update user metadata
  const { data: updateData, error: upErr } = await supabaseAdmin.auth.admin.updateUserById(testUserId, {
    user_metadata: {
      ...user.user_metadata,
      completed_step_ids: updatedCompleted
    }
  });

  if (upErr) {
    console.error("❌ Failed to update metadata:", upErr);
  } else {
    console.log("🎉 SUCCESS! Updated user_metadata.completed_step_ids:", updateData.user.user_metadata.completed_step_ids);
  }
}

testUserMetadataProgress();
