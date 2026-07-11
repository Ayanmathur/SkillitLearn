const fs = require("fs");
const path = require("path");

const srcDir = "C:/Users/mathu/.gemini/antigravity/brain/8e3b80cc-7793-4bdb-a47b-9b018c004d97";
const destDir = path.resolve(__dirname, "../public/testimonials");

const mapping = {
  jayant_kumar: "jayant-kumar.png",
  avni_singh: "avni-singh.png",
  arnav_sable: "arnav-sable.png",
  geet_katore: "geet-katore.png",
  yashpal_rahane: "yashpal-rahane.png",
};

fs.readdirSync(srcDir).forEach((file) => {
  if (!file.endsWith(".png")) return;
  for (const [key, dest] of Object.entries(mapping)) {
    if (file.startsWith(key)) {
      const src = path.join(srcDir, file);
      const out = path.join(destDir, dest);
      fs.copyFileSync(src, out);
      console.log(`Copied: ${file} -> ${dest}`);
    }
  }
});
