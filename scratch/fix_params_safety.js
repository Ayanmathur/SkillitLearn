const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'app', '(main)', 'careers');

function fixPage(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace await params with Promise.resolve(params) helper for safe execution in Next.js 14
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*await\s+params;/g, 'const { $1 } = await Promise.resolve(params);');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p);
    } else if (f === 'page.tsx') {
      fixPage(p);
    }
  });
}

walkDir(srcDir);
console.log('Made params resolution safe across all career route pages!');
