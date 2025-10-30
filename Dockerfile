# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy all app files
COPY . .

# Copy Prisma schema (adapt this line based on your repo structure)
COPY prisma ./prisma

# Generate Prisma client (optional but recommended)
RUN npx prisma generate --schema=./prisma/schema.prisma || echo "⚠️ Prisma schema not found, skipping generation"

# Build Next.js app
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
