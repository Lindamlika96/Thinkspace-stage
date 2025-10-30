# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
# 👉 Use npm ci if package-lock.json exists, otherwise fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy all source files and build the app
COPY . .
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built artifacts and public assets from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start", "-p", "3000"]
