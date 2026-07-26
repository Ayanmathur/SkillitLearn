const { Client } = require('pg');

async function testSni() {
  console.log("=== Testing Supabase Pooler SNI servername ===");

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

  const poolerHosts = [
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-ap-south-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com'
  ];

  for (const host of poolerHosts) {
    console.log("Testing host with SNI:", host);
    const client = new Client({
      host: host,
      port: 6543,
      user: 'postgres.pghgxwjkwrkxnncpsrwu',
      password: 'maymvmvm@2002',
      database: 'postgres',
      ssl: {
        servername: 'pghgxwjkwrkxnncpsrwu.supabase.co',
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log("🎉 CONNECTED TO SUPABASE POSTGRES VIA SNI!");
      await client.query(ddl);
      console.log("🎉 ALL TABLES CREATED AND GRANTED SUCCESSFULLY!");
      await client.end();
      return;
    } catch (e) {
      console.error("❌ SNI Failed:", e.message);
    }
  }
}

testSni();
