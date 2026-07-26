const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'src', 'app', '(admin)');

function walkDir(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/track-step-actions/g, 'module-step-actions');
      content = content.replace(/track-detail-client/g, 'module-detail-client');
      fs.writeFileSync(p, content, 'utf8');
    }
  });
}

walkDir(adminDir);
console.log('Fixed admin import path references!');
