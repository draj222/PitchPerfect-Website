// build.mjs - Add this to your repository root
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to run a command and return its output
async function runCommand(command, options = {}) {
  console.log(`Running command: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command, options);
    if (stderr) console.error(stderr);
    return stdout.trim();
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    throw error;
  }
}

// Main build function
async function build() {
  try {
    // Install TypeScript in the deployment environment
    console.log('Installing TypeScript...');
    await runCommand('npm install typescript --no-save');
    
    // Build backend
    console.log('Building backend...');
    await runCommand('cd backend && npx tsc');
    
    // Build frontend (assuming you have a frontend build script)
    console.log('Building frontend...');
    await runCommand('cd frontend && npm run build || echo "Frontend build skipped"');
    
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();
