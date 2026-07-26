const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  console.log('Seeding Supabase database with sample Careers, Paths, Skills, Modules, and Steps...');

  // 1. Career: Software Engineering
  const { data: sweCareer, error: sweErr } = await supabase
    .from('careers')
    .upsert({
      name: 'Software Engineering',
      slug: 'software-engineering',
      description: 'Master modern full-stack development, cloud computing, and software architecture.',
      icon: '💻',
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (sweErr) console.error('Error inserting SWE Career:', sweErr);

  if (sweCareer) {
    // Path: Full Stack Web Developer
    const { data: fsPath, error: fsErr } = await supabase
      .from('career_paths')
      .upsert({
        career_id: sweCareer.id,
        name: 'Full Stack Web Developer',
        slug: 'full-stack-web-developer',
        description: 'Learn HTML, CSS, JavaScript, React, Next.js, and backend databases.',
        estimated_hours: 40,
        order_index: 0,
      }, { onConflict: 'career_id,slug' })
      .select()
      .single();

    if (fsErr) console.error('Error inserting FS Path:', fsErr);

    if (fsPath) {
      // Skill: React & Next.js Fundamentals
      const { data: reactSkill, error: rErr } = await supabase
        .from('skills')
        .upsert({
          path_id: fsPath.id,
          name: 'React & Next.js Fundamentals',
          slug: 'react-nextjs-fundamentals',
          description: 'Build interactive user interfaces with components, props, state, and server components.',
          order_index: 0,
        }, { onConflict: 'path_id,slug' })
        .select()
        .single();

      if (rErr) console.error('Error inserting React Skill:', rErr);

      if (reactSkill) {
        // Module 1
        const { data: reactMod, error: modErr } = await supabase
          .from('modules')
          .insert({
            skill_id: reactSkill.id,
            title: 'Module 1: React Component Architecture',
            order_index: 0,
          })
          .select()
          .single();

        if (reactMod) {
          await supabase.from('steps').insert([
            {
              module_id: reactMod.id,
              title: 'Step 1: Understanding JSX and Components',
              content: 'React components are the building blocks of modern web applications. JSX allows you to write HTML-like structure directly inside JavaScript.',
              order_index: 0,
            },
            {
              module_id: reactMod.id,
              title: 'Step 2: Managing State with useState',
              content: 'State allows React components to remember information and update the screen when user interactions occur.',
              order_index: 1,
            },
          ]);
        }
      }
    }
  }

  // 2. Career: Data Science & AI
  const { data: dataCareer, error: dataErr } = await supabase
    .from('careers')
    .upsert({
      name: 'Data Science & Artificial Intelligence',
      slug: 'data-science-ai',
      description: 'Learn Python, data analytics, machine learning, and AI engineering.',
      icon: '📊',
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (dataCareer) {
    const { data: daPath } = await supabase
      .from('career_paths')
      .upsert({
        career_id: dataCareer.id,
        name: 'Data Analyst',
        slug: 'data-analyst',
        description: 'Master SQL, Python, Pandas, and data visualization to drive business insights.',
        estimated_hours: 30,
        order_index: 0,
      }, { onConflict: 'career_id,slug' })
      .select()
      .single();

    if (daPath) {
      const { data: sqlSkill } = await supabase
        .from('skills')
        .upsert({
          path_id: daPath.id,
          name: 'SQL & Relational Databases',
          slug: 'sql-relational-databases',
          description: 'Query databases using SELECT, JOIN, GROUP BY, and aggregations.',
          order_index: 0,
        }, { onConflict: 'path_id,slug' })
        .select()
        .single();

      if (sqlSkill) {
        const { data: sqlMod } = await supabase
          .from('modules')
          .insert({
            skill_id: sqlSkill.id,
            title: 'Module 1: Querying Data with SQL',
            order_index: 0,
          })
          .select()
          .single();

        if (sqlMod) {
          await supabase.from('steps').insert([
            {
              module_id: sqlMod.id,
              title: 'Step 1: Introduction to SQL Select Queries',
              content: 'SQL (Structured Query Language) is the standard language for storing, manipulating, and retrieving data in databases.',
              order_index: 0,
            },
          ]);
        }
      }
    }
  }

  console.log('Successfully populated sample careers, paths, skills, modules, and steps into Supabase!');
}

seed();
