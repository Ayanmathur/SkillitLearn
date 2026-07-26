const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'public', 'founder-signature.jpg');
const dest = path.join(__dirname, '..', 'public', 'signature.png');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied founder signature to public/signature.png');
} else {
  console.log('Source signature not found at:', src);
}
