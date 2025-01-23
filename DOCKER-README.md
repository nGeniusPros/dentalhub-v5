# DentalHub Docker Setup

This repository contains Docker configurations for running the DentalHub application. The setup includes containers for both the frontend and backend services.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- Node.js 18+ (for local development)
- pnpm installed globally (`npm install -g pnpm`)

## Project Structure

```
.
├── apps
│   ├── frontend
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── api
│       └── Dockerfile
├── docker-compose.yml
└── DOCKER-README.md
```

## Quick Start

1. Build and start the containers:
```bash
docker compose up --build
```

2. Access the application:
- Frontend: http://localhost
- API: http://localhost:3000

## Services

### Frontend
- React application served by Nginx
- Built with Vite
- Runs on port 80
- Includes proper routing configuration
- Optimized for production

### API
- Node.js/Express backend
- Runs on port 3000
- Includes health checks
- Security hardened
- Production optimized

## Development Workflow

1. Clone the repository:
```bash
git clone <repository-url>
cd dentalhub-v5
```

2. Install dependencies:
```bash
pnpm install
```

3. Build and start containers:
```bash
docker compose up --build
```

4. For development with hot reload:
```bash
# Terminal 1 - Start the API
pnpm dev

# Terminal 2 - Start the frontend
cd apps/frontend
pnpm dev
```

## Container Management

### Build Containers
```bash
docker compose build
```

### Start Containers
```bash
docker compose up
```

### Stop Containers
```bash
docker compose down
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f api
```

### Health Checks

Both services include health check endpoints:
- Frontend: http://localhost/health
- API: http://localhost:3000/health

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
# API Configuration
PORT=3000
NODE_ENV=production

# Add other necessary environment variables
```

## Workspace Configuration

The project follows a monorepo structure using pnpm workspaces. Each workspace has its own configuration:

### Frontend Workspace (`apps/frontend`)
```json
{
  "name": "@dentalhub/frontend",
  "private": true,
  "dependencies": {
    "@dentalhub/types": "workspace:*",
    "@dentalhub/ui": "workspace:*"
  }
}
```

### API Gateway Workspace (`apps/api`)
```json
{
  "name": "@dentalhub/api",
  "private": true,
  "dependencies": {
    "@dentalhub/core": "workspace:*",
    "@dentalhub/types": "workspace:*"
  }
}
```

### Shared Packages
- `packages/types`: Common TypeScript types and interfaces
- `packages/ui`: Shared UI components
- `packages/core`: Core business logic and utilities
- `packages/database`: Database models and migrations

Each workspace maintains its own:
- TypeScript configuration (`tsconfig.json`)
- Build settings
- Environment variables
- Unit tests

For development, use the workspace-specific commands:
```bash
# Frontend development
pnpm --filter @dentalhub/frontend dev

# API development
pnpm --filter @dentalhub/api dev

# Build all workspaces
pnpm build
```

## Troubleshooting

1. If containers fail to start:
```bash
# Check container logs
docker compose logs

# Rebuild containers
docker compose up --build
```

2. If services are unreachable:
```bash
# Check container status
docker compose ps

# Check container health
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"
```

3. Common Issues:
- Port conflicts: Ensure ports 80 and 3000 are available
- Memory issues: Check container resource limits
- Network issues: Verify network configuration

## Security Notes

1. The containers run with:
- Non-root users
- Limited capabilities
- Resource constraints
- Health monitoring
- Security headers

2. Best Practices:
- Keep Docker and dependencies updated
- Monitor container logs
- Regular security audits
- Proper secret management

## Contributing

1. Follow the Docker best practices
2. Test containers locally before pushing
3. Update documentation as needed
4. Ensure security measures are maintained

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)