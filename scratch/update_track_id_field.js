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
      if (content.includes('moduleId:')) {
        content = content.replace(/moduleId:/g, 'trackId:');
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated trackId in ${path.relative(srcDir, p)}`);
      }
    }
  });
}

walkDir(srcDir);
