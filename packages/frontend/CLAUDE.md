# Frontend Development Guidelines

## Build/Test Commands
- `npm install` - Install dependencies
- `npm start` - Start development server at http://localhost:3000
- `npm run start:safe` - Start with backend connectivity checks
- `npm run build` - Build production-ready app in the /build folder
- `npm test` - Run all tests in watch mode
- `npm test -- --testNamePattern="test name"` - Run specific test
- `npm test -- src/App.test.js` - Run tests in specific file
- `npm test -- --watchAll=false` - Run tests once without watching

## Backend Connectivity
- `npm run test:backend` - Test backend server connectivity

## Code Style Guidelines

### Imports
- React imports first, then third-party libraries, then local components
- Group related imports together
- Use destructuring for React hooks: `import { useState, useEffect } from 'react'`

### Component Structure
- Use functional components with hooks
- Use JSX fragment syntax `<>...</>` when returning multiple elements
- Keep components focused on a single responsibility

### Naming Conventions
- Files/Components: PascalCase (ThreadView.js)
- Functions/variables: camelCase (handleClick, userData)
- Constants: UPPER_SNAKE_CASE (for true constants)
- CSS classes: kebab-case (thread-container)

### Styling
- Mix of inline styles and CSS classes (project currently uses inline styles primarily)
- Define colors as variables for consistency
- Font families: CSElijah, CSEmory, Eightgon, Sportage Demo

### Error Handling
- Use try/catch for async operations
- Log errors with console.error()
- Provide user-friendly error states in UI

### State Management
- Component state via useState hook
- Side effects via useEffect with proper dependencies
- Navigate with useNavigate from react-router-dom

## Backend Configuration
- Primary production URL: http://170.64.231.250:4000
- Development URL (only used in development mode): http://localhost:4000
- Connection priority:
  1. localStorage setting: localStorage.getItem('REACT_APP_BACKEND_URL')
  2. Environment variable: process.env.REACT_APP_BACKEND_URL 
  3. Default production URL in production environment
  4. Development URL only if explicitly in development mode

## Common Backend Connectivity Issues
1. **Server Unreachable**: 
   - Check if backend server is running
   - Use `npm run test:backend` to verify connectivity

2. **Port Blocked**:
   - Default port is 4000
   - Check firewall rules and network configuration

3. **CORS Issues**:
   - Backend must allow connections from frontend origin
   - Check server CORS configuration

## Debugging Tips
- Check browser console for detailed connection logs
- Set localStorage.setItem('REACT_APP_OFFLINE_MODE', 'true') for offline testing