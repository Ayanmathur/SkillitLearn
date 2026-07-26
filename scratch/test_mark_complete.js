const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);
const prisma = new PrismaClient();

async function testMarkComplete() {
  console.log("=== Testing learner_progress table schema ===");

  // 1. Test Supabase select
  const { data: selectData, error: selectErr } = await supabase
    .from("learner_progress")
    .select("*")
    .limit(1);

  if (selectErr) {
    console.error("❌ Supabase select error:", selectErr);
  } else {
    console.log("✅ Supabase select OK:", selectData);
  }

  // 2. Test Prisma model
  try {
    const pCount = await prisma.learnerProgress.count();
    console.log("✅ Prisma learnerProgress count:", pCount);
  } catch (err) {
    console.error("❌ Prisma learnerProgress error:", err.message);
  }
}

testMarkComplete();
