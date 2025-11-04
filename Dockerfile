############################################
# Stage 1: Builder - install dev deps & build
############################################
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies needed for native builds (if any)
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Install dependencies (including dev) and build
COPY package*.json ./
RUN npm ci

# Copy source and tsconfig, then build to dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

############################################
# Stage 2: Runner - production-only image
############################################
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 \
 && chown -R nodejs:nodejs /app
USER nodejs

# Expose port (server defaults to 5000 if PORT not set)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]
