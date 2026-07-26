const fs = require('fs');
const path = require('path');

// 1. Path Detail Page
const pathDetailPage = path.join(__dirname, '..', 'src', 'app', '(main)', 'careers', '[slug]', '[pathSlug]', 'page.tsx');
let pathContent = fs.readFileSync(pathDetailPage, 'utf8');

pathContent = pathContent.replace(
  `if (user) {
    // Batch queries for all skills`,
  `if (user) {
    try {
    // Batch queries for all skills`
);

pathContent = pathContent.replace(
  `allComplete = completedSkills === totalSkills && totalSkills > 0;
  }`,
  `allComplete = completedSkills === totalSkills && totalSkills > 0;
    } catch (err) {
      console.error("Transient error fetching learner progress:", err);
    }
  }`
);

fs.writeFileSync(pathDetailPage, pathContent, 'utf8');
console.log('Added fail-safe progress guard to PathDetailPage!');

// 2. Skill Detail Page
const skillDetailPage = path.join(__dirname, '..', 'src', 'app', '(main)', 'careers', '[slug]', '[pathSlug]', '[skillSlug]', 'page.tsx');
if (fs.existsSync(skillDetailPage)) {
  let skillContent = fs.readFileSync(skillDetailPage, 'utf8');

  skillContent = skillContent.replace(
    `if (user) {
    const [completedSteps, quizAttempt, completion] = await Promise.all([`,
    `if (user) {
    try {
    const [completedSteps, quizAttempt, completion] = await Promise.all([`
  );

  skillContent = skillContent.replace(
    `skillComplete = hasPassedQuiz && completedStepIds.size >= totalSteps;
  }`,
    `skillComplete = hasPassedQuiz && completedStepIds.size >= totalSteps;
    } catch (err) {
      console.error("Transient error fetching skill progress:", err);
    }
  }`
  );

  fs.writeFileSync(skillDetailPage, skillContent, 'utf8');
  console.log('Added fail-safe progress guard to SkillBookletPage!');
}
