const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directory
const dir = path.join(__dirname, '..', 'public', 'images', 'careers');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Read the career-explorer.tsx file
const filePath = path.join(__dirname, '..', 'src', 'components', 'career-explorer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Extract the CAREER_IMAGES object block
const match = content.match(/const CAREER_IMAGES: Record<string, string> = {([\s\S]*?)};\n/);
if (!match) {
  console.error("Could not find CAREER_IMAGES");
  process.exit(1);
}

const block = match[1];
const lines = block.split('\n');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(`Failed to download: ${response.statusCode} for ${url}`);
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
};

const workingFallback = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop";

async function run() {
  let newContent = content;

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Parse key and url
    const parts = line.match(/"(.*?)":\s*"(.*?)"/);
    if (parts) {
      const key = parts[1];
      const url = parts[2];
      
      if (url.startsWith('/images/')) continue; // already local
      
      const filename = `${key}.jpg`;
      const dest = path.join(dir, filename);
      
      try {
        console.log(`Downloading ${key}...`);
        await download(url, dest);
        
        // Check if file is too small (might be an error page or broken image)
        const stat = fs.statSync(dest);
        if (stat.size < 5000) {
          throw new Error("File too small, probably broken image");
        }
        
      } catch (e) {
        console.log(`Error downloading ${key}, using fallback:`, e);
        await download(workingFallback, dest);
      }
      
      // Replace URL in content
      const localPath = `/images/careers/${filename}`;
      newContent = newContent.replace(`"${url}"`, `"${localPath}"`);
    }
  }

  fs.writeFileSync(filePath, newContent);
  console.log("Done updating career-explorer.tsx!");
}

run();
