FROM node:18-alpine AS builder

# Add security updates and create non-root user
RUN apk update 
RUN apk upgrade 
RUN addgroup -g 1001 -S nodejs 
RUN adduser -S nodejs -u 1001 -G nodejs

# Install pnpm globally before switching user
RUN npm install -g pnpm

WORKDIR /app
RUN chown nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Copy root config files
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace files
COPY --chown=nodejs:nodejs packages ./packages
COPY --chown=nodejs:nodejs apps/api ./apps/api

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build packages in order with debug output
WORKDIR /app/packages/core
RUN echo "Building core package..."
RUN pnpm build
RUN dir dist

WORKDIR /app/packages/database
RUN echo "Building database package..."
RUN pnpm build
RUN dir dist

WORKDIR /app/apps/api
RUN echo "Building API package..."
RUN pnpm build
RUN dir dist
RUN node --input-type=module -e "import { promises as fs } from 'fs'; fs.access('dist/index.js').then(() => console.log('dist/index.js exists')).catch(() => console.log('dist/index.js not found'))"

# Production stage
FROM node:18-alpine

# Add security updates and create non-root user
RUN apk update 
RUN apk upgrade 
RUN addgroup -g 1001 -S nodejs 
RUN adduser -S nodejs -u 1001 -G nodejs

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app
RUN chown nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Copy package files
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs --from=builder /app/packages/core/package.json ./packages/core/
COPY --chown=nodejs:nodejs --from=builder /app/packages/database/package.json ./packages/database/
COPY --chown=nodejs:nodejs --from=builder /app/apps/api/package.json ./apps/api/

# Copy built files
COPY --chown=nodejs:nodejs --from=builder /app/packages/core/dist ./packages/core/dist
COPY --chown=nodejs:nodejs --from=builder /app/packages/database/dist ./packages/database/dist
COPY --chown=nodejs:nodejs --from=builder /app/apps/api/dist ./apps/api/dist

# Debug: List contents of api dist directory
RUN dir /app/apps/api/dist || echo "API dist directory not found"

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD node --input-type=module -e "const res = await fetch('http://localhost:3000/health'); process.exit(res.ok ? 0 : 1)"

WORKDIR /app/apps/api
CMD ["node", "--experimental-specifier-resolution=node", "--input-type=module", "dist/index.js"]