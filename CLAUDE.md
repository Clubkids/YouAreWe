# YouAreWe - Development Guide

This project uses a monorepo structure with Yarn Berry workspaces.

## Project Structure
- `packages/backend`: Strapi backend with real-time chat functionality
- `packages/frontend`: React frontend application
- `packages/shared`: Shared TypeScript types and utilities

## Yarn Berry Commands
```bash
# Install dependencies
node .yarn/releases/yarn-4.7.0.cjs install

# Build shared package
node .yarn/releases/yarn-4.7.0.cjs workspace @YouAreWe/shared build

# Start frontend
node .yarn/releases/yarn-4.7.0.cjs workspace @YouAreWe/frontend start

# Start backend
node .yarn/releases/yarn-4.7.0.cjs workspace @YouAreWe/backend start
```

## Development Commands

### Root Commands
```bash
# Start both frontend and backend in development mode
yarn dev

# Start only the frontend in development mode
yarn dev:frontend

# Start only the backend in development mode
yarn dev:backend

# Build all packages
yarn build
```

### Backend Commands
```bash
# Start Strapi development server
yarn workspace @YouAreWe/backend dev

# Build Strapi for production
yarn workspace @YouAreWe/backend build

# Start Strapi in production mode
yarn workspace @YouAreWe/backend start
```

### Frontend Commands
```bash
# Start React development server
yarn workspace @YouAreWe/frontend start

# Build React for production
yarn workspace @YouAreWe/frontend build

# Run tests
yarn workspace @YouAreWe/frontend test
```

### Shared Commands
```bash
# Build shared package
yarn workspace @YouAreWe/shared build

# Build shared package in watch mode
yarn workspace @YouAreWe/shared dev
```

## Environment Variables

### Backend Environment Variables
- `PORT`: Server port (default: 4000)

### Frontend Environment Variables
- `REACT_APP_BACKEND_URL`: Backend server URL (default: http://170.64.231.250:4000)
- `REACT_APP_ENV`: Environment name ('production' for production)
- `REACT_APP_OFFLINE_MODE`: Set to 'true' for offline testing mode

## Testing

### Backend Tests
```bash
# Test chat functionality
yarn workspace @YouAreWe/backend test:chat

# Test cross-device functionality
yarn workspace @YouAreWe/backend test:cross-device

# Test port selection
yarn workspace @YouAreWe/backend test:port-selection
```

### Frontend Tests
```bash
# Run all tests
yarn workspace @YouAreWe/frontend test

# Run tests in CI mode with coverage
yarn workspace @YouAreWe/frontend test:ci

# Check backend connectivity
yarn workspace @YouAreWe/frontend test:backend

# Test WebSocket connectivity
yarn workspace @YouAreWe/frontend test:socket
```

## Technology Stack
- **Backend**: Strapi, Socket.io, TypeScript
- **Frontend**: React, Socket.io-client, styled-components
- **Shared**: TypeScript

## Important Notes
- Socket.io versions must be compatible between frontend and backend (both using 4.x)
- The backend is configured for SQLite database with better-sqlite3
- Node.js v18-22 is required