#!/usr/bin/env node

/**
 * Backend server health check script
 * This script performs a comprehensive test of the backend server
 */

const http = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration - universal accessibility URL
const ENV = process.env.NODE_ENV || 'development';
const SERVER_URLS = ENV === 'development' 
  ? [
      'http://localhost:4000',  // Try localhost first in development
      'http://170.64.231.250:4000'  // Fallback to production URL
    ]
  : [
      'http://170.64.231.250:4000'  // Production URL only in production
    ];
const HEALTH_ENDPOINT = '/api/health';
const TIMEOUT = 3000; // Shorter timeout for faster testing

console.log('Testing multiple possible server URLs...\n');

// Function to test a specific URL
async function testServerUrl(serverUrl) {
  const url = new URL(serverUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: HEALTH_ENDPOINT,
    method: 'GET',
    timeout: TIMEOUT
  };
  
  return new Promise((resolve) => {
    console.log(`Testing ${serverUrl}${HEALTH_ENDPOINT}...`);
    const req = http.request(options, (res) => {
      console.log(`HTTP Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log('Parsed JSON response:', jsonData);
          
          resolve({
            url: serverUrl,
            status: 'success',
            response: jsonData
          });
        } catch (e) {
          console.log(`Response parsing error: ${e.message}`);
          resolve({
            url: serverUrl,
            status: 'error',
            error: `Invalid JSON: ${e.message}`
          });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`Error connecting to ${serverUrl}: ${error.message}`);
      resolve({
        url: serverUrl,
        status: 'error',
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      console.log(`Connection to ${serverUrl} timed out after ${TIMEOUT}ms`);
      req.destroy();
      resolve({
        url: serverUrl,
        status: 'timeout',
        error: 'Connection timeout'
      });
    });
    
    req.end();
  });
}

console.log(`
========================================
  Backend Server Health Check Tool
========================================
Testing URLs: ${SERVER_URLS.join(', ')}
Endpoint: ${HEALTH_ENDPOINT}
Timeout: ${TIMEOUT}ms
`);

// Main function to test all server URLs
async function checkAllServers() {
  const results = [];
  
  // Test each URL sequentially
  for (const serverUrl of SERVER_URLS) {
    const result = await testServerUrl(serverUrl);
    results.push(result);
    
    // If we found a working server, no need to check others
    if (result.status === 'success') {
      break;
    }
    
    // Add some spacing between tests
    console.log('---');
  }
  
  // Find any successful results
  const successfulServer = results.find(r => r.status === 'success');
  
  if (successfulServer) {
    console.log(`\n✅ BACKEND SERVER FOUND AT: ${successfulServer.url}`);
    
    // Create a configuration file to help frontend connect
    try {
      const configContent = `// Auto-generated backend configuration
export const BACKEND_URL = '${successfulServer.url}';
export const SERVER_STATUS = '${successfulServer.response.status || "ok"}';
`;
      
      const configPath = path.join(__dirname, '../src/config/backend.js');
      fs.writeFileSync(configPath, configContent);
      console.log(`\nConfiguration saved to ${configPath}`);
      console.log('The frontend will now connect to the correct backend URL.');
    } catch (e) {
      console.error(`\nFailed to save configuration: ${e.message}`);
    }
    
    process.exit(0);
  } else {
    console.log('\n❌ NO BACKEND SERVER FOUND ON ANY OF THE TESTED URLS');
    console.log('\nPossible issues:');
    console.log('1. Backend server is not running');
    console.log('2. Backend server is running on a different host or port');
    console.log('3. Network or firewall issue is blocking the connection');
    console.log('4. Backend server is not responding to HTTP requests on the /api/health endpoint');
    
    // Try to determine if process is running at all
    try {
      console.log('\nChecking for running backend processes...');
      const processCmd = 'ps aux | grep strapi';
      const processResult = execSync(processCmd, { encoding: 'utf8' });
      console.log(processResult);
    } catch (e) {
      console.log(`Process check failed: ${e.message}`);
    }
    
    process.exit(1);
  }
}

// Start the checks
checkAllServers();