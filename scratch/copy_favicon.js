const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.png');

if (fs.existsSync(logoPath)) {
  fs.copyFileSync(logoPath, path.join(publicDir, 'favicon.ico'));
  fs.copyFileSync(logoPath, path.join(publicDir, 'icon.png'));
  fs.copyFileSync(logoPath, path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Successfully updated favicons (favicon.ico, icon.png, apple-touch-icon.png) with SkillItLearn logo!');
} else {
  console.error('logo.png not found in public/');
}
