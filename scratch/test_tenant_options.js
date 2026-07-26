const { Client } = require('pg');

async function testTenantOptions() {
  console.log("=== Testing Supabase Pooler with options parameter ===");

  const ddl = `
    CREATE TABLE IF NOT EXISTS public.learner_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      step_id UUID NOT NULL REFERENCES public.steps(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT learner_progress_user_step_unique UNIQUE(user_id, step_id)
    );

    CREATE TABLE IF NOT EXISTS public.quiz_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
      score FLOAT NOT NULL,
      passed BOOLEAN NOT NULL DEFAULT FALSE,
      answers_json JSONB,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.skill_completion (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
      steps_completed BOOLEAN NOT NULL DEFAULT FALSE,
      quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      CONSTRAINT skill_completion_user_skill_unique UNIQUE(user_id, skill_id)
    );

    GRANT ALL ON public.learner_progress TO anon, authenticated, service_role;
    GRANT ALL ON public.quiz_attempts TO anon, authenticated, service_role;
    GRANT ALL ON public.skill_completion TO anon, authenticated, service_role;

    NOTIFY pgrst, 'reload schema';
  `;

  const connectionStrings = [
    "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
    "postgresql://postgres:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?options=project%3Dpghgxwjkwrkxnncpsrwu",
    "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
    "postgresql://postgres:maymvmvm%402002@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?options=project%3Dpghgxwjkwrkxnncpsrwu"
  ];

  for (const str of connectionStrings) {
    console.log("Connecting:", str);
    const client = new Client({ connectionString: str, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      console.log("🎉 CONNECTED TO SUPABASE POSTGRES!");
      await client.query(ddl);
      console.log("🎉 ALL DDL TABLES CREATED SUCCESSFULLY IN SUPABASE!");
      await client.end();
      return;
    } catch (e) {
      console.error("❌ Connection failed:", e.message);
    }
  }
}

testTenantOptions();
