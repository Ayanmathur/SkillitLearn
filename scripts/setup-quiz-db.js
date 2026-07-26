const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupAndSeedQuizzes() {
  console.log('🚀 Checking Supabase database connection...');

  const { data: skills, error: sErr } = await supabase.from('skills').select('id, name, description');

  if (sErr || !skills || skills.length === 0) {
    console.error('Error fetching skills:', sErr);
    return;
  }

  console.log(`Found ${skills.length} skills in database. Generating 30 questions (10 Easy, 10 Moderate, 10 Difficult) for each skill...`);

  let totalQuestionsInserted = 0;

  for (const skill of skills) {
    const questions = [];
    const difficulties = ['easy', 'moderate', 'difficult'];

    difficulties.forEach((diff) => {
      for (let i = 1; i <= 10; i++) {
        let qText = '';
        let options = [];
        let correctIdx = 0;
        let explanation = '';

        if (diff === 'easy') {
          qText = `What is the primary core objective when learning ${skill.name} (Fundamentals #${i})?`;
          options = [
            `To understand fundamental principles and apply core workflows of ${skill.name}`,
            `To completely avoid using modern digital tools and standards`,
            `To bypass quality checks and skip foundational knowledge`,
            `To automate tasks without testing underlying logic`,
          ];
          correctIdx = 0;
          explanation = `The primary objective of ${skill.name} is establishing solid core fundamentals and consistent workflows.`;
        } else if (diff === 'moderate') {
          qText = `Which best practice should be applied when troubleshooting scenarios in ${skill.name} (Practical Scenario #${i})?`;
          options = [
            `Randomly modify parameters until an output appears`,
            `Systematically analyze logs, isolate root causes, and follow standard guidelines`,
            `Ignore system warnings and proceed without validation`,
            `Delete configuration files and start over without auditing`,
          ];
          correctIdx = 1;
          explanation = `Effective ${skill.name} troubleshooting requires structured analysis and systematic root-cause identification.`;
        } else {
          // difficult
          qText = `In an enterprise production environment, how does advanced ${skill.name} handle scalability and performance (Advanced Case #${i})?`;
          options = [
            `By disabling security measures and expanding memory limits unconditionally`,
            `By relying strictly on manual single-threaded execution`,
            `By implementing modular architecture, efficient caching, and resilient error recovery`,
            `By hardcoding environment parameters directly into execution scripts`,
          ];
          correctIdx = 2;
          explanation = `Enterprise-grade ${skill.name} achieves high performance through modular design, caching, and fail-safe recovery patterns.`;
        }

        questions.push({
          skill_id: skill.id,
          question_text: qText,
          options: options,
          correct_option_index: correctIdx,
          explanation: explanation,
          difficulty: diff,
          order_index: (difficulties.indexOf(diff) * 10) + i,
        });
      }
    });

    // Delete any old questions for clean seed
    await supabase.from('quiz_questions').delete().eq('skill_id', skill.id);

    const { error: insErr } = await supabase.from('quiz_questions').insert(questions);

    if (insErr) {
      if (insErr.code === 'PGRST205') {
        console.error(`\n⚠️ Table 'quiz_questions' does not exist in Supabase yet.`);
        console.log(`Please run the following SQL query in your Supabase SQL Editor:\n`);
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
        return;
      }
      console.error(`Error inserting for ${skill.name}:`, insErr.message);
    } else {
      totalQuestionsInserted += questions.length;
    }
  }

  console.log(`\n🎉 Quiz question seeding completed successfully! Inserted ${totalQuestionsInserted} total questions.`);
}

setupAndSeedQuizzes();
