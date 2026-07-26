const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('.tracks')) {
        content = content.replace(/\.tracks\b/g, '.modules');
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Fixed .tracks to .modules in ${path.relative(srcDir, p)}`);
      }
    }
  });
}

walkDir(srcDir);
