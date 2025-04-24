const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const svgPath = path.join(__dirname, '../public/images/og-image.svg');
const pngPath = path.join(__dirname, '../public/images/og-image.png');

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Convert SVG to PNG
sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ Successfully converted SVG to PNG');
    console.log(`Saved to: ${pngPath}`);
  })
  .catch(err => {
    console.error('❌ Error converting SVG to PNG:', err);
  }); 