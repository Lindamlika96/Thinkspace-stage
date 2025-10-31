# ---- Build stage ----
FROM node:20-alpine AS builder
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

# 2️⃣ Copy dependency files + prisma schema
COPY package*.json ./
COPY prisma ./prisma

# 3️⃣ Install dependencies without running postinstall
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps --ignore-scripts; else npm install --legacy-peer-deps --ignore-scripts; fi

# 4️⃣ Generate Prisma client manually (now that CLI is installed)
RUN npx prisma generate

# 5️⃣ Copy source code and build
COPY . .
ENV NEXT_DISABLE_WEBPACK_CACHE=1
RUN npm run build

# ---- Run stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
RUN mkdir -p public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# 6️⃣ Install only production dependencies (skip postinstall again)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps --ignore-scripts; else npm install --omit=dev --legacy-peer-deps --ignore-scripts; fi

# 7️⃣ Expose and start
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
