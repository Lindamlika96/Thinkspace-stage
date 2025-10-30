# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package definitions and prisma schema early
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (ignore peer conflicts)
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy all other source files
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
