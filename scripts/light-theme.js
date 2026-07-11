const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We want to replace dark hero/header backgrounds with a light green or white theme
  // bg-[#1a1a2e] -> bg-green-50
  if (content.includes('bg-[#1a1a2e]')) {
    // Replace the background
    content = content.replace(/bg-\[#1a1a2e\]/g, 'bg-green-50');
    
    // Within these files, there are text-white classes meant for the dark background.
    // However, some text-white might be inside buttons (btn-primary, bg-accent, bg-green-500)
    // We should be careful. We can replace common patterns:
    
    // For breadcrumbs & standard text
    content = content.replace(/text-white\/50/g, 'text-gray-500');
    content = content.replace(/text-white\/70/g, 'text-gray-600');
    content = content.replace(/text-white\/75/g, 'text-gray-600');
    content = content.replace(/text-white\/80/g, 'text-gray-700');
    content = content.replace(/text-white\/90/g, 'text-gray-800');
    
    // Specific text-white that are NOT inside buttons. We'll do a simple regex:
    // This is tricky. Let's just look at specific tags:
    content = content.replace(/text-white mb-4/g, 'text-gray-900 mb-4');
    content = content.replace(/text-white mb-6/g, 'text-gray-900 mb-6');
    content = content.replace(/text-white mb-8/g, 'text-gray-900 mb-8');
    content = content.replace(/text-white font-bold/g, 'text-gray-900 font-bold');
    content = content.replace(/hover:text-white/g, 'hover:text-accent');
    
    // Backgrounds
    content = content.replace(/bg-white\/5/g, 'bg-white/60');
    content = content.replace(/bg-white\/10/g, 'bg-white/80');
    content = content.replace(/bg-white\/20/g, 'bg-white');
    content = content.replace(/border-white\/10/g, 'border-gray-200');
  }

  // Also replace #1a1a2e used in tooltip in careers page
  if (content.includes('bg-[#1a1a2e]')) {
     content = content.replace(/bg-\[#1a1a2e\]/g, 'bg-gray-900');
  }
  
  if (content.includes('text-[#1a1a2e]')) {
     content = content.replace(/text-\[#1a1a2e\]/g, 'text-gray-900');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
