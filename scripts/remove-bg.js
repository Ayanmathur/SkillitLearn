const { Jimp, rgbaToInt } = require('jimp');
const path = require('path');

async function removeBackground() {
  try {
    console.log('Loading logo.jpg...');
    const image = await Jimp.read('public/logo.jpg');
    
    // We want to make white and near-white pixels transparent.
    // The logo has a white background.
    const targetColor = { r: 255, g: 255, b: 255, a: 255 };
    const threshold = 30; // tolerance for near-white pixels

    console.log('Processing pixels...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate distance from white
      if (r > 255 - threshold && g > 255 - threshold && b > 255 - threshold) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    // Save as PNG
    console.log('Saving as logo.png...');
    await image.write('public/logo.png');
    
    // Create favicon version
    const iconImage = await Jimp.read('public/logo.png');
    iconImage.resize({ w: 256 }); // Resize for favicon
    await iconImage.write('src/app/icon.png');
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

removeBackground();
