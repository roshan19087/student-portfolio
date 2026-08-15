# ===================================================
# Stage 1: Base & Dependencies
# ===================================================
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy package manifests across monorepo workspaces
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm ci

# ===================================================
# Stage 2: Builder
# ===================================================
FROM base AS builder
WORKDIR /app

COPY . .

# Generate Prisma Client
RUN npx --workspace=server prisma generate

# Build shared library, server, and client bundle
ENV NODE_ENV=production
RUN npm run build

# Prune dev dependencies for lean production runner
RUN npm prune --production

# ===================================================
# Stage 3: Production API Server Runner
# ===================================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Create dedicated unprivileged user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy production node_modules and built artifacts
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/shared ./shared
COPY --from=builder --chown=appuser:nodejs /app/server ./server

# Ensure upload directory exists and is writable
RUN mkdir -p /app/server/uploads && chown -R appuser:nodejs /app/server/uploads

USER appuser

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
