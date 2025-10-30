# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# 1️⃣ Pass environment variables from Jenkins
ARG OPENAI_API_KEY
ARG OPENROUTER_API_KEY
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG NEO4J_URI
ARG NEO4J_USERNAME
ARG NEO4J_PASSWORD

ENV OPENAI_API_KEY=$OPENAI_API_KEY \
    OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    DATABASE_URL=$DATABASE_URL \
    NEO4J_URI=$NEO4J_URI \
    NEO4J_USERNAME=$NEO4J_USERNAME \
    NEO4J_PASSWORD=$NEO4J_PASSWORD

# 2️⃣ Copy dependency definitions + prisma schema
COPY package*.json ./
COPY prisma ./prisma

# 3️⃣ Install dependencies safely
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# 4️⃣ Copy source code
COPY . .

# 5️⃣ Build Next.js app (Next 15.x)
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies + built app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next

# Handle missing public/ folder gracefully
RUN mkdir -p public

# Copy your Next.js config (uses .mjs)
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install only production deps
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi

# Expose port & run app
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
