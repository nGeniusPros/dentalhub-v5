# DentalHub Monorepo

## Project Structure

```
dentalhub-v5/
├── apps/
│   ├── frontend/          # React/TypeScript frontend application
│   └── api/              # Express API Gateway
├── packages/
│   ├── core/             # Shared utilities and types
│   ├── database/         # Supabase client and database utilities
│   └── tsconfig/         # Shared TypeScript configurations
└── services/             # Backend microservices (to be implemented)
    ├── patient/
    ├── communication/
    ├── insurance/
    └── ai/
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase
- **Package Manager**: pnpm
- **AI Services**: OpenAI, Gemini
- **Communication**: Retell.ai
- **Practice Management**: Sikka API

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   - Copy .env.example to .env
   - Fill in required API keys and configurations

3. Start development servers:

   ```bash
   # Start frontend
   pnpm --filter frontend dev

   # Start API gateway
   pnpm --filter api dev
   ```

## Development Workflow

1. The project uses a monorepo structure with pnpm workspaces
2. Shared code is in the packages directory
3. Each service is independently deployable
4. Frontend communicates through the API gateway

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests (to be implemented)

## Architecture Overview

1. **Frontend Layer**

   - React/TypeScript application
   - Component-based architecture
   - State management with React Context

2. **API Gateway**

   - Central entry point for all requests
   - Request routing and validation
   - Authentication/Authorization

3. **Service Layer**

   - Independent microservices
   - Domain-specific business logic
   - Scalable and maintainable

4. **Database Layer**
   - Supabase for data persistence
   - Real-time capabilities
   - Secure data access

## External Integrations

- Sikka API for practice management
- Retell.ai for voice communications
- OpenAI for various AI capabilities
- Gemini API for additional AI features

## Security

- JWT-based authentication
- Role-based access control
- API rate limiting
- Secure environment variables
