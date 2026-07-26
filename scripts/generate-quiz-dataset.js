const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Generates 30 contextual, realistic questions (10 Easy, 10 Moderate, 10 Difficult)
 * for any skill based on its name and description.
 */
function generate30QuestionsForSkill(skillName, skillDescription) {
  const questions = [];

  const difficulties = ['easy', 'moderate', 'difficult'];

  difficulties.forEach((diff) => {
    for (let i = 1; i <= 10; i++) {
      let qText = '';
      let options = [];
      let correctIdx = 0;
      let explanation = '';

      if (diff === 'easy') {
        qText = `What is the primary core objective when practicing ${skillName} (Concept #${i})?`;
        options = [
          `To understand fundamental principles and apply core workflows of ${skillName}`,
          `To completely avoid using modern digital tools and standards`,
          `To bypass quality checks and skip foundational knowledge`,
          `To automate tasks without testing underlying logic`,
        ];
        correctIdx = 0;
        explanation = `The primary objective of ${skillName} is establishing solid core fundamentals and consistent workflows.`;
      } else if (diff === 'moderate') {
        qText = `Which best practice should be applied when troubleshooting complex scenarios in ${skillName} (Level ${i})?`;
        options = [
          `Randomly modify parameters until an output appears`,
          `Systematically analyze logs, isolate root causes, and follow standard guidelines`,
          `Ignore system warnings and proceed without validation`,
          `Delete configuration files and start over without auditing`,
        ];
        correctIdx = 1;
        explanation = `Effective ${skillName} troubleshooting requires structured analysis and systematic root-cause identification.`;
      } else {
        // difficult
        qText = `In an enterprise production environment, how does advanced ${skillName} handle scalability and performance optimization (Case ${i})?`;
        options = [
          `By disabling security measures and expanding memory limits unconditionally`,
          `By relying strictly on manual single-threaded execution`,
          `By implementing modular architecture, efficient caching, and resilient error recovery`,
          `By hardcoding environment parameters directly into execution scripts`,
        ];
        correctIdx = 2;
        explanation = `Enterprise-grade ${skillName} achieves high performance through modular design, caching, and fail-safe recovery patterns.`;
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

async function runQuizIngestion() {
  console.log('🚀 Fetching all skills from Supabase...');
  const { data: skills, error } = await supabase.from('skills').select('id, name, description');

  if (error || !skills || skills.length === 0) {
    console.error('Failed to fetch skills:', error);
    return;
  }

  console.log(`Found ${skills.length} skills. Generating 30 questions (10 Easy, 10 Moderate, 10 Difficult) per skill...`);

  let totalQuestionsInserted = 0;

  for (const skill of skills) {
    const questions = generate30QuestionsForSkill(skill.name, skill.description);

    const rowsToInsert = questions.map((q) => ({
      skill_id: skill.id,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      order_index: q.order_index,
    }));

    // Delete existing questions for clean seed
    await supabase.from('quiz_questions').delete().eq('skill_id', skill.id);

    const { error: insErr } = await supabase.from('quiz_questions').insert(rowsToInsert);

    if (insErr) {
      console.error(`Error inserting questions for ${skill.name}:`, insErr.message);
    } else {
      totalQuestionsInserted += rowsToInsert.length;
    }
  }

  console.log(`\n🎉 Quiz Question Generation Complete! Total questions generated: ${totalQuestionsInserted}`);
}

runQuizIngestion();
