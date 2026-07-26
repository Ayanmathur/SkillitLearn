const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const srcDir = path.join(__dirname, '..', 'src');
const allFiles = getAllFiles(srcDir);

let countEmDash = 0;
let countModuleText = 0;

allFiles.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove em-dash —
  if (content.includes('—')) {
    content = content.replace(/—/g, ' : ');
    content = content.replace(/\s+:\s+/g, ' : '); // clean extra spaces
    countEmDash++;
  }

  // 2. Replace user-facing "Module" / "module" text in UI strings and labels
  // Note: Keep DB PostgREST table name "modules" as-is for backend queries unless specified,
  // but change UI labels: "Module" -> "Track", "modules" -> "tracks"

  content = content.replace(/Module\s+(\d+)/g, 'Track $1');
  content = content.replace(/Module\s+([A-Z0-9])/g, 'Track $1');
  content = content.replace(/Module\s+([a-z0-9])/g, 'Track $1');
  content = content.replace(/Skill Booklet/g, 'Skill Booklet Track');
  content = content.replace(/Booklet Content/g, 'Track Content');
  content = content.replace(/modules/g, 'tracks');
  content = content.replace(/Module/g, 'Track');
  content = content.replace(/Modules/g, 'Tracks');

  // Fix any accidental double replacements or lower/upper issues
  content = content.replace(/tracks\s*\.\s*map/g, 'modules.map'); // preserve PostgREST object fields if needed
  content = content.replace(/tracks\s*:\s*/g, 'modules: ');
  content = content.replace(/tracks\s*\(/g, 'modules(');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    countModuleText++;
  }
});

console.log(`Refactored ${countEmDash} files with em-dashes and ${countModuleText} files with Track terminology!`);
