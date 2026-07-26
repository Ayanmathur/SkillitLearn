const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testQuery() {
  console.log("=== Testing Supabase PostgREST queries ===");

  // 1. Get first 5 careers
  const { data: careers, error: cErr } = await supabase
    .from("careers")
    .select("id, name, slug")
    .limit(5);

  console.log("Careers:", careers, "Error:", cErr);

  if (careers && careers.length > 0) {
    const testSlug = careers[0].slug;
    console.log(`\nTesting getCareerBySlug for: '${testSlug}'`);

    const { data: career, error: singleErr } = await supabase
      .from("careers")
      .select(`
        id,
        name,
        slug,
        description,
        icon,
        career_paths (
          id,
          name,
          slug,
          description,
          order_index,
          skills (
            id,
            name,
            slug,
            description,
            order_index
          )
        )
      `)
      .eq("slug", testSlug)
      .single();

    console.log("Result:", career ? `Found '${career.name}' with ${career.career_paths?.length || 0} paths` : "NULL", "Error:", singleErr);
  }
}

testQuery();
