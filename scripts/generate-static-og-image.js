const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a canvas with Open Graph dimensions
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Draw background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, width, height);

// Add red gradient circle elements similar to the site
function drawGradientCircle(x, y, radius, opacity) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(196, 30, 58, ${opacity})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Add background elements
drawGradientCircle(100, 100, 300, 0.2);
drawGradientCircle(width - 100, height - 100, 300, 0.2);

// Add "Voice-enabled Discord bot" label
ctx.fillStyle = 'rgba(196, 30, 58, 0.1)';
ctx.beginPath();
ctx.roundRect(100, 120, 220, 30, 15);
ctx.fill();

ctx.strokeStyle = 'rgba(196, 30, 58, 0.2)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.roundRect(100, 120, 220, 30, 15);
ctx.stroke();

ctx.fillStyle = '#C41E3A';
ctx.font = 'bold 16px Arial, sans-serif';
ctx.fillText('Voice-enabled Discord bot', 120, 140);

// Add main title
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 72px Arial, sans-serif';
ctx.fillText('Perfect Your Pitch', 100, 220);

// Add "AI Feedback" with underline
ctx.fillStyle = '#C41E3A';
ctx.font = 'bold 72px Arial, sans-serif';
ctx.fillText('with AI Feedback', 100, 300);

ctx.fillStyle = 'rgba(196, 30, 58, 0.3)';
ctx.fillRect(100, 310, 500, 4);

// Add description text
ctx.fillStyle = '#AAAAAA';
ctx.font = '24px Arial, sans-serif';
ctx.fillText('🎤 Pitch Perfect listens to your startup pitch in real-time,', 100, 360);
ctx.fillText('transcribes it using Whisper, and delivers instant investor-', 100, 400);
ctx.fillText('style feedback via GPT-4 — all from inside a Discord voice channel.', 100, 440);

// Add logo on the right side
function drawLogo(x, y, size) {
  // Outer circle
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = '#C41E3A';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  
  // Microphone body
  ctx.fillStyle = '#C41E3A';
  ctx.beginPath();
  ctx.roundRect(x - size * 0.35, y - size * 0.6, size * 0.7, size * 1.2, size * 0.15);
  ctx.fill();
  
  // Microphone lines
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.roundRect(x - size * 0.2, y - size * 0.5 + i * size * 0.15, size * 0.4, size * 0.07, size * 0.02);
    ctx.fill();
  }
}

// Draw a large logo to the right
drawLogo(900, 300, 200);

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/images/og-image.png'), buffer);

console.log('Open Graph image saved to public/images/og-image.png'); 