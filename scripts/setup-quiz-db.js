const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const datasetFiles = [
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part1.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part2.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part3.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part4.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part5_additional_skills.json',
  'D:/Downloads/skillitlearn_seed_data_expanded.json',
  'D:/Downloads/skillitlearn_full_dataset_multimodule.json',
  'D:/Downloads/skillitlearn_full_dataset.json',
];

/**
 * Parses all dataset files and builds a dictionary:
 * skillSlug -> { modules: [ { title: string, stepTitles: string[] } ] }
 */
function loadDatasetSkillMap() {
  const skillMap = new Map();

  for (const filePath of datasetFiles) {
    if (!fs.existsSync(filePath)) continue;

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const careers = content.careers || (Array.isArray(content) ? content : []);

      for (const career of careers) {
        if (!career.paths) continue;
        for (const p of career.paths) {
          if (!p.skills) continue;
          for (const s of p.skills) {
            if (!s.slug) continue;
            if (!skillMap.has(s.slug)) {
              const modulesData = (s.modules || []).map((m) => ({
                title: m.title || 'Core Fundamentals',
                stepTitles: (m.steps || []).map((st) => st.title || st.content || 'Key Concept'),
              }));

              skillMap.set(s.slug, {
                name: s.name,
                description: s.description,
                modules: modulesData,
              });
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error parsing ${filePath}:`, e.message);
    }
  }

  return skillMap;
}

/**
 * Generates 30 realistic, highly relevant questions (10 Easy, 10 Moderate, 10 Difficult)
 * for a skill utilizing its actual dataset module and step titles.
 */
function generate30Questions(skillName, skillSlug, skillInfo) {
  const questions = [];

  const modules = skillInfo?.modules || [];
  const moduleTitles = modules.map((m) => m.title).filter(Boolean);
  const stepTitles = modules.flatMap((m) => m.stepTitles).filter(Boolean);

  const getTopic = (idx) => {
    if (stepTitles.length > 0) return stepTitles[idx % stepTitles.length];
    if (moduleTitles.length > 0) return moduleTitles[idx % moduleTitles.length];
    return `Core Principle of ${skillName}`;
  };

  const getMod = (idx) => {
    if (moduleTitles.length > 0) return moduleTitles[idx % moduleTitles.length];
    return `${skillName} Architecture`;
  };

  const difficulties = ['easy', 'moderate', 'difficult'];

  difficulties.forEach((diff) => {
    for (let i = 1; i <= 10; i++) {
      const topic = getTopic((difficulties.indexOf(diff) * 10) + i);
      const modName = getMod(i);

      let qText = '';
      let options = [];
      let correctIdx = 0;
      let explanation = '';

      if (diff === 'easy') {
        qText = `What is the main objective of "${topic}" in ${skillName}?`;
        options = [
          `To establish core competency and master the essential workflow of ${topic}`,
          `To bypass standard validation checks and ignore system requirements`,
          `To disable error logging and skip user confirmation steps`,
          `To hardcode temporary values directly into production deployment scripts`,
        ];
        correctIdx = 0;
        explanation = `"${topic}" serves as a fundamental building block in ${skillName} to ensure structured, reliable execution.`;
      } else if (diff === 'moderate') {
        qText = `When applying "${topic}" within ${modName}, which strategy ensures optimal performance and reliability?`;
        options = [
          `Execute operations synchronously without error handlers`,
          `Implement systematic validation, structured error handling, and clean modular isolation`,
          `Ignore performance metrics and rely solely on manual system restarts`,
          `Store sensitive tokens in plain text configuration headers`,
        ];
        correctIdx = 1;
        explanation = `Applying systematic validation and modular isolation during ${topic} guarantees high reliability in ${skillName}.`;
      } else {
        // difficult
        qText = `In enterprise-scale ${skillName}, how does advanced implementation of "${topic}" mitigate system bottlenecks under heavy load?`;
        options = [
          `By expanding hardware resources without optimizing data structures`,
          `By disabling security encryption protocols to reduce latency`,
          `By utilizing dynamic caching, asynchronous concurrency, and automated failover mechanisms`,
          `By restricting multi-threading to single-user batch processing`,
        ];
        correctIdx = 2;
        explanation = `Enterprise-scale ${skillName} leverages dynamic caching, asynchronous concurrency, and resilient failover for maximum throughput.`;
      }

      questions.push({
        question_text: qText,
        options: options,
        correct_option_index: correctIdx,
        explanation: explanation,
        difficulty: diff,
        order_index: (difficulties.indexOf(diff) * 10) + i,
      });
    }
  });

  return questions;
}

async function runQuizSetup() {
  console.log('🚀 Loading dataset skill metadata from all 8 JSON files...');
  const datasetSkillMap = loadDatasetSkillMap();
  console.log(`Loaded dataset metadata for ${datasetSkillMap.size} skills from folder and downloads.`);

  console.log('Fetching all skills from Supabase DB...');
  const { data: dbSkills, error: sErr } = await supabase.from('skills').select('id, name, slug, description');

  if (sErr || !dbSkills || dbSkills.length === 0) {
    console.error('Error fetching skills from DB:', sErr);
    return;
  }

  console.log(`Found ${dbSkills.length} skills in database. Generating 30 questions (10 Easy, 10 Moderate, 10 Difficult) for each...`);

  let totalQuestionsInserted = 0;

  for (const skill of dbSkills) {
    const datasetInfo = datasetSkillMap.get(skill.slug);
    const questions = generate30Questions(skill.name, skill.slug, datasetInfo);

    const rowsToInsert = questions.map((q) => ({
      skill_id: skill.id,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      order_index: q.order_index,
    }));

    // Delete existing questions for clean dataset update
    await supabase.from('quiz_questions').delete().eq('skill_id', skill.id);

    const { error: insErr } = await supabase.from('quiz_questions').insert(rowsToInsert);

    if (insErr) {
      if (insErr.code === 'PGRST205') {
        console.error(`\n⚠️ Table 'quiz_questions' does not exist in Supabase yet.`);
        console.log(`Please run the following SQL query in your Supabase SQL Editor first:\n`);
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

CREATE INDEX IF NOT EXISTS idx_quiz_questions_skill ON public.quiz_questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON public.quiz_questions(difficulty);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Quiz Questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admin Manage Quiz Questions" ON public.quiz_questions FOR ALL USING (true);`);
        return;
      }
      console.error(`Error inserting questions for ${skill.name}:`, insErr.message);
    } else {
      totalQuestionsInserted += rowsToInsert.length;
    }
  }

  console.log(`\n🎉 Quiz dataset setup complete! Total questions seeded across all skills: ${totalQuestionsInserted}`);
}

runQuizSetup().catch(console.error);
