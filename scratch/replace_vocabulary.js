const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(__dirname, '..', 'src');
let updatedFiles = 0;

walkDir(srcDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace em-dash "—" with ":" or "," or "|"
  content = content.replace(/\s*—\s*/g, ' - ');
  content = content.replace(/—/g, ' - ');

  // Replace "Module" / "module" in user-facing labels & headings (preserve code variables/types if appropriate, but update labels)
  // "Module 1" -> "Track 1", "modules" -> "tracks", "Module" -> "Track"
  content = content.replace(/\bModule\b/g, 'Track');
  content = content.replace(/\bModules\b/g, 'Tracks');
  content = content.replace(/\bmodule\b/g, 'track');
  content = content.replace(/\bmodules\b/g, 'tracks');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedFiles++;
  }
});

console.log(`Successfully updated vocabulary in ${updatedFiles} files across src/!`);
