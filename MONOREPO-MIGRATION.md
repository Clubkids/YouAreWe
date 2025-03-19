# Frontend Migration Guide

## Environment Variables
- `REACT_APP_BACKEND_URL`: Backend server URL (default: http://170.64.231.250:4000)
- `REACT_APP_ENV`: Environment name ('production' for production)
- `REACT_APP_OFFLINE_MODE`: Set to 'true' for offline testing mode

## Development & Build Commands
- `npm start`: Start development server at http://localhost:3000
- `npm run start:safe`: Start with backend connectivity checks
- `npm run build`: Build production-ready app in the /build folder
- `npm test`: Run all tests in watch mode
- `npm run test:ci`: Run tests in CI mode with coverage
- `npm run test:backend`: Check backend server status
- `npm run test:socket`: Launch WebSocket testing page

## API Endpoints
- WebSocket connection: `http://170.64.231.250:4000` (or configured BACKEND_URL)
- Socket.io path: `/socket.io`
- Health check: `/api/health`

## Configuration Requirements
- Socket.io client version: 4.8.1 (must be compatible with backend)
- WebSocket configuration:
  ```js
  {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 15000,
    transports: ['websocket', 'polling'],
    path: '/socket.io',
    autoConnect: true
  }
  ```
- Browser compatibility is configured in package.json browserslist

## Monorepo Integration Notes
1. Code should be moved to `packages/frontend` in the monorepo
2. Backend URLs will need to be updated for local development
3. Test configuration paths may need adjustment
4. Scripts in the scripts/ folder should be reviewed for path references