#!/usr/bin/env node

/**
 * Enhanced starter script that validates backend connectivity before starting the frontend
 */

const http = require('http');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration - universal accessibility
const ENV = process.env.NODE_ENV || 'development';
const PRODUCTION_URL = 'http://170.64.231.250:4000';
const LOCALHOST_URL = 'http://localhost:4000';
// In development, try localhost first, then production URL
const DEFAULT_BACKEND_URL = ENV === 'development' ? LOCALHOST_URL : PRODUCTION_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL;

// Extract host and port from URL
const backendUrl = new URL(BACKEND_URL);
const HOST = backendUrl.hostname;
const PORT = backendUrl.port || (backendUrl.protocol === 'https:' ? 443 : 80);

console.log(`
========================================
    Frontend Startup Script  
========================================
Environment: ${ENV}
Backend URL: ${BACKEND_URL}
Host: ${HOST}
Port: ${PORT}
`);

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Check if the backend server is accessible
 */
function checkBackendServer() {
  return new Promise((resolve) => {
    console.log(`Checking if backend server is running at ${HOST}:${PORT}...`);
    
    const req = http.request({
      host: HOST,
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ Backend server is running!');
            console.log(`Server info:`, jsonData);
            
            
            resolve(true);
          } catch (e) {
            console.log('✅ Backend server responded, but with invalid JSON');
            resolve(true);
          }
        } else {
          console.log(`⚠️ Backend server responded with status code ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Backend server not accessible: ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('❌ Backend server connection timeout');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

/**
 * Main function to start the app
 */
async function main() {
  // Check backend server
  const backendRunning = await checkBackendServer();
  
  if (!backendRunning && ENV === 'development') {
    console.log('\n⚠️ Backend server appears to be offline. What would you like to do?');
    console.log('1. Continue without backend (messages will not be sent/received)');
    console.log('2. Start in offline mode (simulated backend)');
    console.log('3. Abort startup');
    
    rl.question('Enter your choice (1-3): ', (answer) => {
      rl.close();
      
      switch (answer.trim()) {
        case '1':
          console.log('\nStarting frontend without backend...');
          startFrontend();
          break;
        case '2':
          console.log('\nStarting in offline mode...');
          process.env.REACT_APP_OFFLINE_MODE = 'true';
          startFrontend();
          break;
        case '3':
          console.log('\nStartup aborted.');
          process.exit(0);
          break;
        default:
          console.log('\nInvalid choice. Aborting startup.');
          process.exit(1);
      }
    });
  } else {
    // Start frontend normally
    startFrontend();
  }
}

/**
 * Start the React frontend
 */
function startFrontend() {
  console.log('\nStarting frontend application...');
  
  const reactStart = spawn('npm', ['start'], { 
    stdio: 'inherit',
    shell: true
  });
  
  reactStart.on('error', (err) => {
    console.error('Failed to start frontend:', err);
    process.exit(1);
  });
}

// Run the main function
main();