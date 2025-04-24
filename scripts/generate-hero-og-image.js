const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log('Opening page...');
    const page = await browser.newPage();
    
    // Set viewport to standard Open Graph image size
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });
    
    // Navigate to local development server
    console.log('Navigating to localhost...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for the hero section to be fully loaded
    await page.waitForSelector('section.relative.min-h-screen');
    
    // Take a screenshot of just the hero section
    console.log('Taking screenshot of hero section...');
    const heroSection = await page.$('section.relative.min-h-screen');
    const screenshot = await heroSection.screenshot({
      type: 'png',
      omitBackground: false
    });
    
    // Save the screenshot to the public images directory
    const outputPath = path.join(__dirname, '../public/images/og-image.png');
    fs.writeFileSync(outputPath, screenshot);
    console.log(`Screenshot saved to ${outputPath}`);
  } catch (error) {
    console.error('Error generating OG image:', error);
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
})(); 