# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all files and build
COPY . .
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npx", "next", "start", "-p", "3000"]
