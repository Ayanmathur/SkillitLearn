const fs = require('fs');
const path = require('path');

const adminActionsDir = path.join(__dirname, '..', 'src', 'app', '(admin)', 'admin', 'actions');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/prisma\.track\b/g, 'prisma.module');
  content = content.replace(/prisma\.tracks\b/g, 'prisma.module');
  fs.writeFileSync(filePath, content, 'utf8');
}

fs.readdirSync(adminActionsDir).forEach((file) => {
  if (file.endsWith('.ts')) {
    fixFile(path.join(adminActionsDir, file));
  }
});

console.log('Restored prisma.module references in admin actions!');
