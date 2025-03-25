/**
 * testSetup.js - Common setup for tests
 * 
 * This module provides functions to set up and tear down the
 * environment for testing.
 */

// This is a Jest test to prevent the "no tests found" error
test('testSetup is properly loaded', () => {
  expect(true).toBe(true);
});

// Setup mock for localStorage
const setupLocalStorageMock = (initialData = {}) => {
  const store = {
    userToken: 'mock-jwt-token',
    ...initialData
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => {
          delete store[key];
        });
      }),
      key: jest.fn(index => Object.keys(store)[index] || null),
      get length() {
        return Object.keys(store).length;
      }
    },
    writable: true,
    configurable: true
  });
  
  return store;
};

// Setup mock for sessionStorage
const setupSessionStorageMock = (initialData = {}) => {
  const store = { ...initialData };
  
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => {
          delete store[key];
        });
      }),
      key: jest.fn(index => Object.keys(store)[index] || null),
      get length() {
        return Object.keys(store).length;
      }
    },
    writable: true,
    configurable: true
  });
  
  return store;
};

// Setup mock for axios
const setupAxiosMock = (mockImplementations = {}) => {
  const defaultImplementations = {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} })
  };
  
  const axiosMock = {
    ...defaultImplementations,
    ...mockImplementations
  };
  
  // Return mock reset function
  const resetAxiosMock = () => {
    Object.values(axiosMock).forEach(mockFn => {
      mockFn.mockClear();
    });
  };
  
  return { axios: axiosMock, resetAxiosMock };
};

// Suppress React warnings during tests
const suppressReactWarnings = () => {
  const originalConsoleError = console.error;
  console.error = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' && (
        args[0].includes('Warning:') ||
        args[0].includes('React does not recognize') ||
        args[0].includes('Invalid prop') ||
        args[0].includes('Maximum update depth exceeded')
      )
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  });
  
  return () => {
    console.error = originalConsoleError;
  };
};

export {
  setupLocalStorageMock,
  setupSessionStorageMock,
  setupAxiosMock,
  suppressReactWarnings
};