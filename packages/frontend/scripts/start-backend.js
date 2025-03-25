#!/usr/bin/env node

/**
 * Helper script to start the backend server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find backend folder
const backendPath = path.resolve(__dirname, '../../backend');

// Check if backend folder exists
if (!fs.existsSync(backendPath)) {
  console.error(`Backend folder not found at ${backendPath}`);
  process.exit(1);
}

// Path to the backend's package.json
const packageJsonPath = path.join(backendPath, 'package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error(`package.json not found at ${packageJsonPath}`);
  process.exit(1);
}

// Parse package.json to get available scripts
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error(`Error parsing package.json: ${error.message}`);
  process.exit(1);
}

console.log('Available scripts in backend:');
for (const scriptName in packageJson.scripts) {
  console.log(`- ${scriptName}: ${packageJson.scripts[scriptName]}`);
}

// Function to start the backend server
function startBackend() {
  console.log('\nStarting backend server with port-safe startup...');
  
  // Create a process to run "npm run start:safe" in the backend directory
  const backend = spawn('npm', ['run', 'start:safe'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true
  });
  
  backend.on('error', (error) => {
    console.error(`Failed to start backend: ${error.message}`);
    process.exit(1);
  });
  
  // Handle Ctrl+C to gracefully shut down
  process.on('SIGINT', () => {
    console.log('Stopping backend server...');
    backend.kill('SIGINT');
    process.exit(0);
  });
  
  // Keep the script running
  console.log('Backend server starting. Press Ctrl+C to stop.');
}

// Start the backend
startBackend();