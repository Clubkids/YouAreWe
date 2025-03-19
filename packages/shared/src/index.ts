// Shared types, utilities, and constants for use in both frontend and backend

// Utility functions
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}