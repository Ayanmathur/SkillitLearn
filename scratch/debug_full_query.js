const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function debugFullQuery() {
  // Exactly reproduce what getSkillBySlug does in DAL
  const { data, error } = await supabase
    .from("skills")
    .select(`
      id,
      name,
      slug,
      description,
      order_index,
      path_id,
      career_paths (
        id,
        name,
        slug,
        careers (
          id,
          name,
          slug
        )
      ),
      modules (
        id,
        title,
        order_index,
        steps (
          id,
          title,
          content,
          media_urls,
          order_index
        )
      ),
      quiz_questions (
        id,
        question_text,
        options,
        correct_option_index,
        explanation,
        order_index
      )
    `)
    .eq("slug", "react-nextjs-fundamentals")
    .single();

  if (error) {
    console.log("ERROR from getSkillBySlug query:", error);
  } else {
    console.log("SUCCESS:", data.name);
    console.log("Path:", data.career_paths?.name);
    console.log("Career:", data.career_paths?.careers?.name);
    console.log("Modules:", data.modules?.length);
    console.log("Quiz:", data.quiz_questions?.length);
  }

  // Also reproduce getPathBySlug
  const { data: pathData, error: pathError } = await supabase
    .from("career_paths")
    .select(`
      id,
      name,
      slug,
      description,
      order_index,
      career_id,
      careers (
        id,
        name,
        slug
      ),
      skills (
        id,
        name,
        slug,
        description,
        order_index,
        modules (
          id,
          steps (
            id
          )
        )
      )
    `)
    .eq("slug", "full-stack-web-developer")
    .single();

  if (pathError) {
    console.log("\nPATH ERROR:", pathError);
  } else {
    console.log("\nPATH SUCCESS:", pathData.name);
    console.log("Career:", pathData.careers);
    console.log("Skills:", pathData.skills?.length);
  }

  // Check RLS policies  
  console.log("\n=== Checking RLS ===");
  const { data: careers, error: careersErr } = await supabase
    .from("careers")
    .select("id, name, slug, icon")
    .limit(3);
  console.log("Careers with icon column:", careers, careersErr);
}

debugFullQuery();
