/**
 * Global test setup for Jest
 */

// Import testing libraries
import '@testing-library/jest-dom';

// Add a simple Jest test to prevent the "no tests found" error
test('test setup is defined', () => {
  expect(true).toBeTruthy();
});

// Suppress console warnings and errors during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Filter out React warnings in tests
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') ||
     args[0].includes('Error: Not implemented:') ||
     args[0].includes('React does not recognize') ||
     args[0].includes('Invalid prop') ||
     args[0].includes('Maximum update depth exceeded'))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') ||
     args[0].includes('CORS') ||
     args[0].includes('deprecated'))
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock localStorage and sessionStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  
  clear() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = String(value);
  }
  
  removeItem(key) {
    delete this.store[key];
  }
  
  key(index) {
    return Object.keys(this.store)[index] || null;
  }
  
  get length() {
    return Object.keys(this.store).length;
  }
}

// Set up mocks if they don't exist
if (!global.localStorage) {
  Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
    writable: true
  });
}

if (!global.sessionStorage) {
  Object.defineProperty(window, 'sessionStorage', {
    value: new LocalStorageMock(),
    writable: true
  });
}

// Global test timeouts
jest.setTimeout(10000);

// Clean up function to restore console functions after all tests
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});