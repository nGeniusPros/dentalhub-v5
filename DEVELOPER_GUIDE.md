# DentalHub v5 Developer Guide

## Project Overview

DentalHub v5 is a comprehensive dental practice management system built using a modern tech stack. The application follows a monorepo structure using pnpm workspaces.

## Current Issues and Debugging Notes

### 1. Backend API Errors (Priority: High)

- **500 Internal Server Errors**
  - Endpoint: `/api/auth/me`
  - Endpoint: `/api/dashboard/*`
  - Potential causes: Middleware configuration issues, unhandled exceptions
- **404 Not Found Errors**
  - External API calls to Retell AI
  - Likely due to incorrect endpoint configuration or missing authentication

### 2. Authentication System

- Currently using Supabase for authentication
- Supporting both header and cookie-based authentication
- Recent updates to error handling in auth middleware
- Key files:
  - `/apps/api/src/middleware/auth.ts`
  - `/apps/api/src/services/authService.ts`

### 3. Environment Configuration

Required Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Retell AI Configuration
VITE_RETELL_API_KEY=
VITE_RETELL_BASE_URL=
```

## Project Architecture

### Frontend Structure (/apps/frontend)

```
/frontend
├── /src
│   ├── /components      # Reusable UI components
│   ├── /features        # Feature-specific components
│   │   ├── /admin      # Admin dashboard features
│   │   ├── /patient    # Patient portal features
│   │   └── /staff      # Staff dashboard features
│   ├── /hooks          # Custom React hooks
│   ├── /layouts        # Page layouts
│   ├── /lib           # Utility functions and constants
│   ├── /pages         # Page components
│   ├── /services      # API service layers
│   └── /types         # TypeScript type definitions
```

### Backend Structure (/apps/api)

```
/api
├── /src
│   ├── /middleware     # Express middleware
│   ├── /routes        # API route handlers
│   ├── /services      # Business logic and external service integration
│   ├── /types         # TypeScript type definitions
│   └── /utils         # Utility functions
```

## Key Dependencies

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Client

### Backend

- Express
- TypeScript
- Supabase
- Retell AI SDK

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use ES modules (import/export) not CommonJS
- Include proper type definitions
- Follow the monorepo workspace structure

### API Development

1. Define types in `/apps/api/src/types`
2. Implement service logic in `/apps/api/src/services`
3. Create route handlers in `/apps/api/src/routes`
4. Add middleware as needed in `/apps/api/src/middleware`

### Error Handling

- Use the error handling middleware for consistent error responses
- Log errors with appropriate context
- Return structured error responses to the client

### Authentication

- Use Supabase authentication
- Support both header and cookie authentication methods
- Validate user sessions in auth middleware

## Testing

- Jest for unit testing
- Test files located in `/apps/api/src/tests`
- Run tests with `pnpm test`

## Deployment

- Docker configuration available
- Environment-specific docker-compose files:
  - `docker-compose.dev.yml`
  - `docker-compose.prod.yml`

## Next Steps for Debugging

1. Review error logs for the 500 errors
2. Verify Retell AI configuration and endpoints
3. Test authentication flow with both methods
4. Validate environment variables in all environments

## Additional Resources

- Supabase Documentation
- Retell AI API Documentation
- Project README.md
- DOCKER-README.md for deployment instructions

| | | patient.ts react-jsx-runtime.profiling.min.jss
| | | staff.ts react.development.js.js.map.mapjs
| | | | | react.production.min.jse.jssated.json
| | \---utils | react.shared-subset.development.js
| | common.ts react.shared-subset.production.min.js
| | helpers.tsdex.jserenceBy.jsus-square.js.mapd.json
| | | | +---node_modulesceWith.js.jsean.d.tss.map
| \---utils | | \---.binjsons minus.js.mapd.ts.mapts
| cn.ts | loose-envifytor-check.jsated.jsonp
| | | | | loose-envify.CMDcheck.js.maps
\---supabase | | loose-envify.ps1dot.jssor.js.map
| config.toml |modulesdropLast.js monitor-dot.js.mappd.json
| | | \---umdquireLastWhile.jstor-down.jss.d.ts.map
+---.branches react.development.jsdown.js.mappn.js
| \_current_branch react.production.min.js.jsjsated.json
| | | react.profiling.min.jsf.js.mapg.js
\---.temp | | each.js monitor-pause.js
cli-latestlibrc eachRight.jsmonitor-pause.js.map.json
| | | | | CopyrightNotice.txtitor-play.js.js
PS C:\Users\micha\OneDrive\Desktop\Projects\Dental Hub\dentalhub-v5>
