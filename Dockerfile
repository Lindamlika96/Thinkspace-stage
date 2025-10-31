# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Pass environment variables from Jenkins
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

COPY package*.json ./
COPY prisma ./prisma

RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi
COPY . .

# Disable persistent webpack caching to save disk space
ENV NEXT_DISABLE_WEBPACK_CACHE=1

RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
RUN mkdir -p public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
