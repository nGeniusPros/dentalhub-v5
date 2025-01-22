# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.6.0

# Copy workspace config files
COPY package.json pnpm-workspace.yaml ./

# Copy all workspace packages
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install

# Copy source files
COPY packages/core ./packages/core
COPY packages/database ./packages/database
COPY packages/tsconfig ./packages/tsconfig
COPY apps/frontend ./apps/frontend

# Build workspace packages first (tsconfig must come first)
RUN pnpm --filter "@dentalhub/tsconfig" build
RUN pnpm --filter "@dentalhub/core" build
RUN pnpm --filter "@dentalhub/database" build

# Build the frontend application
WORKDIR /app/apps/frontend
RUN pnpm build

# Use nginx to serve the application
FROM nginx:alpine

# Copy nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]