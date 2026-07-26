const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';
const supabase = createClient(supabaseUrl, anonKey);

async function checkQuiz() {
  // Try quiz_questions
  const { data: d1, error: e1 } = await supabase.from("quiz_questions").select("id").limit(1);
  console.log("quiz_questions:", d1, e1);

  // Try quizquestions
  const { data: d2, error: e2 } = await supabase.from("quizquestions").select("id").limit(1);
  console.log("quizquestions:", d2, e2);

  // Try quiz
  const { data: d3, error: e3 } = await supabase.from("quiz").select("id").limit(1);
  console.log("quiz:", d3, e3);

  // Check skill without quiz_questions
  const { data, error } = await supabase
    .from("skills")
    .select(`
      id, name, slug, description, order_index, path_id,
      career_paths (id, name, slug, careers (id, name, slug)),
      modules (id, title, order_index, steps (id, title, content, media_urls, order_index))
    `)
    .eq("slug", "react-nextjs-fundamentals")
    .single();
  console.log("\nSkill WITHOUT quiz_questions:", error ? error : `Found ${data.name}, modules: ${data.modules?.length}`);
}

checkQuiz();
