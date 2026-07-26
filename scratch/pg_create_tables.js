const { Client } = require('pg');

const connStrings = [
  "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  "postgresql://postgres:maymvmvm%402002@db.pghgxwjkwrkxnncpsrwu.supabase.co:5432/postgres",
  "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
];

async function createTablesWithPg() {
  console.log("=== Creating tables directly via Postgres Client ===");

  let connectedClient = null;

  for (const str of connStrings) {
    console.log("Connecting to:", str.split('@')[1]);
    const client = new Client({
      connectionString: str,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log("🎉 CONNECTED TO SUPABASE POSTGRES!");
      connectedClient = client;
      break;
    } catch (e) {
      console.error("Connection failed:", e.message);
    }
  }

  if (!connectedClient) {
    console.error("Could not connect to Postgres database directly.");
    return;
  }

  const ddl = `
    -- 1. Ensure users table structure
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT,
      role TEXT NOT NULL DEFAULT 'learner',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 2. Create learner_progress table
    CREATE TABLE IF NOT EXISTS public.learner_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      step_id UUID NOT NULL REFERENCES public.steps(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT learner_progress_user_step_unique UNIQUE(user_id, step_id)
    );

    -- 3. Create quiz_attempts table
    CREATE TABLE IF NOT EXISTS public.quiz_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
      score FLOAT NOT NULL,
      passed BOOLEAN NOT NULL DEFAULT FALSE,
      answers_json JSONB,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 4. Create skill_completion table
    CREATE TABLE IF NOT EXISTS public.skill_completion (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
      steps_completed BOOLEAN NOT NULL DEFAULT FALSE,
      quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      CONSTRAINT skill_completion_user_skill_unique UNIQUE(user_id, skill_id)
    );

    -- Grant permissions to PostgREST roles
    GRANT ALL ON public.users TO anon, authenticated, service_role;
    GRANT ALL ON public.learner_progress TO anon, authenticated, service_role;
    GRANT ALL ON public.quiz_attempts TO anon, authenticated, service_role;
    GRANT ALL ON public.skill_completion TO anon, authenticated, service_role;

    -- Reload PostgREST schema cache
    NOTIFY pgrst, 'reload schema';
  `;

  try {
    await connectedClient.query(ddl);
    console.log("🎉 ALL TABLES CREATED AND PERMISSIONS GRANTED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ DDL Execution Error:", err);
  } finally {
    await connectedClient.end();
  }
}

createTablesWithPg();
