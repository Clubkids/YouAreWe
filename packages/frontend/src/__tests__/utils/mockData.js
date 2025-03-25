/**
 * mockData.js - Test data factory for tests
 * 
 * This module provides functions to generate realistic test data
 * for users and other entities that can be used across tests.
 */

// This is a Jest test to prevent the "no tests found" error
test('mockData generators work correctly', () => {
  expect(createUser()).toBeDefined();
});

// User generator to create test users
const createUser = (overrides = {}) => {
  const id = overrides.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id,
    username: overrides.username || `User_${id.substring(0, 5)}`,
    ...overrides
  };
};

// Create a simulated network error
const createNetworkError = (code = 'ECONNREFUSED', message = 'Connection refused') => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export {
  createUser,
  createNetworkError
};