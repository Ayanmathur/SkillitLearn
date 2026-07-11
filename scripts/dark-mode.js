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

  // Add dark mode support to the backgrounds that were changed to green-50
  if (content.includes('bg-green-50')) {
    content = content.replace(/bg-green-50/g, 'bg-green-50 dark:bg-[#1a1a2e]');
    content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
    content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-white/90');
    content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-white/80');
    content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-white/75');
    content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-white/60');
    content = content.replace(/bg-white\/60/g, 'bg-white/60 dark:bg-white/5');
    content = content.replace(/bg-white\/80/g, 'bg-white/80 dark:bg-white/10');
    content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-white/10');
  }

  // Also replace some explicit text-gray in hero sections
  if (content.includes('text-gray-900 dark:text-white mb-6')) {
    // Already did the text-gray-900
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
