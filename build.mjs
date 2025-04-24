import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';

// Ensure the .next directory exists
try {
  await mkdir('.next', { recursive: true });
  console.log('Created .next directory');
} catch (error) {
  console.log('Directory already exists or error creating:', error.message);
}

// Run the Next.js build
console.log('Starting Next.js build process...');
const buildProcess = spawn('npx', ['next', 'build'], { 
  stdio: 'inherit',
  env: { ...process.env }
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
}); 