/**
 * Mock for axios
 */

// Default mock responses
const mockResponses = {
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
};

// Create exportable axios mock
const axios = {
  ...mockResponses,
  create: jest.fn().mockReturnThis()
};

// Export the mock
export default axios;