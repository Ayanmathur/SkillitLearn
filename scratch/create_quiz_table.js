const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id')
    .limit(1);

  if (error) {
    console.log("Table status:", error.code, error.message);
    if (error.code === 'PGRST205') {
      console.log("\nTable does NOT exist. Run this SQL in Supabase SQL Editor:\n");
      console.log(`CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL DEFAULT 'moderate',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quiz_questions_skill ON public.quiz_questions(skill_id);
CREATE INDEX idx_quiz_questions_difficulty ON public.quiz_questions(difficulty);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Quiz Questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admin Manage Quiz Questions" ON public.quiz_questions FOR ALL USING (true);`);
    }
  } else {
    console.log("Table EXISTS. Rows found:", data?.length || 0);
  }
}

checkTable();
