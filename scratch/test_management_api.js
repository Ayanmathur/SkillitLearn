const https = require('https');

const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

async function trySupabaseEndpoints() {
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

  // Test PG pooler user format variation: postgres.pghgxwjkwrkxnncpsrwu
  const { Client } = require('pg');
  const hosts = [
    "db.pghgxwjkwrkxnncpsrwu.supabase.co",
    "aws-0-ap-southeast-1.pooler.supabase.com"
  ];

  for (const h of hosts) {
    console.log("Trying host:", h);
    const client = new Client({
      host: h,
      port: 5432,
      user: `postgres.${'pghgxwjkwrkxnncpsrwu'}`,
      password: 'maymvmvm@2002',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log("🎉 SUCCESSFUL DIRECT PG CONNECTION to:", h);
      await client.query(ddl);
      console.log("🎉 ALL DDL TABLES CREATED SUCCESSFULLY!");
      await client.end();
      return;
    } catch (e) {
      console.error(`❌ Host ${h} failed:`, e.message);
    }
  }
}

trySupabaseEndpoints();
