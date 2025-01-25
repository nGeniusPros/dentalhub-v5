# Stage 1: Base
FROM node:20-alpine AS base

# Security: Add security updates and create non-root user
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory and permissions
WORKDIR /app
RUN chown nodejs:nodejs /app

# Install pnpm securely
RUN npm install -g pnpm@latest --no-audit

# Stage 2: Dependencies
FROM base AS deps

# Switch to non-root user
USER nodejs

# Copy workspace config files
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files
COPY --chown=nodejs:nodejs apps/api/package.json ./apps/api/
COPY --chown=nodejs:nodejs packages/core/package.json ./packages/core/
COPY --chown=nodejs:nodejs packages/database/package.json ./packages/database/
COPY --chown=nodejs:nodejs packages/tsconfig/package.json ./packages/tsconfig/

# Install dependencies with security flags
RUN pnpm install --frozen-lockfile


RUN cd packages/database && pnpm exec prisma generate

# Stage 3: Builder
FROM deps AS builder
# Copy source with correct ownership
COPY --chown=nodejs:nodejs . .

# Debugging: List files in /app/packages
RUN ls -la /app/packages

# Install turbo globally
RUN pnpm add turbo --global

# Build core packages first
RUN pnpm turbo build --filter=@dentalhub/core... --filter=!@dentalhub/frontend

# Stage 4: Production
FROM node:20-alpine AS production

# Install security updates and dumb-init
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Security headers and configurations
ENV NODE_ENV=production \
    NPM_CONFIG_AUDIT=true \
    NPM_CONFIG_AUDIT_LEVEL=high \
    NODE_OPTIONS='--max-old-space-size=2048' \
    # Disable npm update notifications
    NO_UPDATE_NOTIFIER=1

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Switch to non-root user
USER nodejs

# Use dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]