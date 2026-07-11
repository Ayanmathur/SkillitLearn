const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const emdash = '\u2014'; // —

async function fixEmDashes() {
  console.log('Fixing em dashes in DB...');
  let count = 0;

  // Careers
  const careers = await prisma.career.findMany();
  for (const c of careers) {
    if (c.name.includes(emdash) || (c.description && c.description.includes(emdash))) {
      await prisma.career.update({
        where: { id: c.id },
        data: {
          name: c.name.replace(new RegExp(emdash, 'g'), '-'),
          description: c.description ? c.description.replace(new RegExp(emdash, 'g'), '-') : c.description
        }
      });
      count++;
    }
  }

  // Paths
  const paths = await prisma.path.findMany();
  for (const p of paths) {
    if (p.name.includes(emdash) || (p.description && p.description.includes(emdash))) {
      await prisma.path.update({
        where: { id: p.id },
        data: {
          name: p.name.replace(new RegExp(emdash, 'g'), '-'),
          description: p.description ? p.description.replace(new RegExp(emdash, 'g'), '-') : p.description
        }
      });
      count++;
    }
  }

  // Skills
  const skills = await prisma.skill.findMany();
  for (const s of skills) {
    if (s.name.includes(emdash) || (s.description && s.description.includes(emdash))) {
      await prisma.skill.update({
        where: { id: s.id },
        data: {
          name: s.name.replace(new RegExp(emdash, 'g'), '-'),
          description: s.description ? s.description.replace(new RegExp(emdash, 'g'), '-') : s.description
        }
      });
      count++;
    }
  }

  // Modules
  const modules = await prisma.module.findMany();
  for (const m of modules) {
    if (m.title.includes(emdash)) {
      await prisma.module.update({
        where: { id: m.id },
        data: {
          title: m.title.replace(new RegExp(emdash, 'g'), '-')
        }
      });
      count++;
    }
  }

  // Steps
  const steps = await prisma.step.findMany();
  for (const s of steps) {
    if (s.title.includes(emdash) || (s.content && s.content.includes(emdash))) {
      await prisma.step.update({
        where: { id: s.id },
        data: {
          title: s.title.replace(new RegExp(emdash, 'g'), '-'),
          content: s.content ? s.content.replace(new RegExp(emdash, 'g'), '-') : s.content
        }
      });
      count++;
    }
  }

  console.log(`Updated ${count} records with em-dashes.`);
}

const TOPIC_IMAGES = {
  "IT & Software": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  "Data & AI": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "Business": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
  "Marketing": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
  "Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
  "Healthcare": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
  "Education": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
  "Engineering": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
  "Personal Dev": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop",
  "Arts & Culture": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop",
  "Other": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
};

async function fixImages() {
  console.log('Fixing career images...');
  const careers = await prisma.career.findMany();
  for (const c of careers) {
    let newUrl = TOPIC_IMAGES["Other"];
    
    // Simple heuristic to assign topic image based on career name
    const n = c.name.toLowerCase();
    if (n.includes('software') || n.includes('developer') || n.includes('cloud') || n.includes('cyber')) newUrl = TOPIC_IMAGES["IT & Software"];
    else if (n.includes('data') || n.includes('machine') || n.includes('ai') || n.includes('analytics')) newUrl = TOPIC_IMAGES["Data & AI"];
    else if (n.includes('business') || n.includes('management') || n.includes('product') || n.includes('sales') || n.includes('hr') || n.includes('recruit')) newUrl = TOPIC_IMAGES["Business"];
    else if (n.includes('design') || n.includes('ux') || n.includes('ui')) newUrl = TOPIC_IMAGES["Design"];
    else if (n.includes('market') || n.includes('seo')) newUrl = TOPIC_IMAGES["Marketing"];
    else if (n.includes('financ') || n.includes('account')) newUrl = TOPIC_IMAGES["Finance"];
    else if (n.includes('health') || n.includes('med') || n.includes('nurs')) newUrl = TOPIC_IMAGES["Healthcare"];
    else if (n.includes('educat') || n.includes('teach')) newUrl = TOPIC_IMAGES["Education"];
    else if (n.includes('engineer')) newUrl = TOPIC_IMAGES["Engineering"];

    if (c.iconUrl !== newUrl) {
      await prisma.career.update({
        where: { id: c.id },
        data: { iconUrl: newUrl }
      });
    }
  }
  console.log('Career images updated.');
}

async function main() {
  await fixEmDashes();
  await fixImages();
}

main().catch(console.error).finally(() => prisma.$disconnect());
