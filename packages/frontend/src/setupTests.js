// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock implementation for window.Audio
beforeAll(() => {
  window.Audio = jest.fn().mockImplementation(() => {
    return {
      play: jest.fn().mockResolvedValue(undefined)
    };
  });
});
