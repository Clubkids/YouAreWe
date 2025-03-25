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

## API Endpoints
- Backend API: `http://170.64.231.250:4000` (or configured BACKEND_URL)
- Health check: `/api/health`

## Configuration Requirements
- Browser compatibility is configured in package.json browserslist

## Monorepo Integration Notes
1. Code should be moved to `packages/frontend` in the monorepo
2. Backend URLs will need to be updated for local development
3. Test configuration paths may need adjustment
4. Scripts in the scripts/ folder should be reviewed for path references