const https = require('https');

const supabaseUrl = 'pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

async function executeSqlViaManagement() {
  console.log("=== Creating progress tables in Supabase Postgres ===");

  const sql = `
    CREATE TABLE IF NOT EXISTS public.learner_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      step_id UUID NOT NULL REFERENCES public.steps(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, step_id)
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
      UNIQUE(user_id, skill_id)
    );

    -- Grant permissions to anon and authenticated roles
    GRANT ALL ON public.learner_progress TO anon, authenticated, service_role;
    GRANT ALL ON public.quiz_attempts TO anon, authenticated, service_role;
    GRANT ALL ON public.skill_completion TO anon, authenticated, service_role;

    -- Reload PostgREST schema cache
    NOTIFY pgrst, 'reload schema';
  `;

  // Try calling query API
  const bodyData = JSON.stringify({ query: sql });

  const req = https.request({
    hostname: supabaseUrl,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Length': Buffer.byteLength(bodyData)
    }
  }, (res) => {
    let responseText = '';
    res.on('data', chunk => responseText += chunk);
    res.on('end', () => {
      console.log(`Response status: ${res.statusCode}`);
      console.log(`Response text: ${responseText}`);
    });
  });

  req.on('error', e => console.error("Req Error:", e));
  req.write(bodyData);
  req.end();
}

executeSqlViaManagement();
