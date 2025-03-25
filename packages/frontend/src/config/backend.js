/**
 * Backend connection configuration
 * 
 * This module provides connection information for the backend server.
 * It automatically detects the proper URLs to use based on the environment.
 */

// Server URL for universal accessibility
const SERVER_URLS = [
  // Production URL is used in all environments for universal accessibility
  'http://170.64.231.250:4000'
];

// Detect proper URL based on environment
function getBackendUrl() {
  // Check if URL is explicitly set in localStorage
  const storedUrl = localStorage.getItem('REACT_APP_BACKEND_URL');
  if (storedUrl) {
    console.log(`Using backend URL from localStorage: ${storedUrl}`);
    return storedUrl;
  }
  
  // Check environment variables
  if (process.env.REACT_APP_BACKEND_URL) {
    console.log(`Using backend URL from environment: ${process.env.REACT_APP_BACKEND_URL}`);
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Always use production URL for universal accessibility
  const url = 'http://170.64.231.250:4000';
  console.log(`Using backend URL: ${url}`);
  return url;
}

export const BACKEND_URL = getBackendUrl();

// Export all possible URLs for diagnostics
export const ALL_URLS = SERVER_URLS;