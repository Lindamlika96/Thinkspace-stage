# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# ----------------------------------------------------------
# 1️⃣ Accept environment variables from Jenkins
# ----------------------------------------------------------
ARG OPENAI_API_KEY
ARG OPENROUTER_API_KEY
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG NEO4J_URI
ARG NEO4J_USERNAME
ARG NEO4J_PASSWORD

# Make them available at build time
ENV OPENAI_API_KEY=$OPENAI_API_KEY \
    OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    DATABASE_URL=$DATABASE_URL \
    NEO4J_URI=$NEO4J_URI \
    NEO4J_USERNAME=$NEO4J_USERNAME \
    NEO4J_PASSWORD=$NEO4J_PASSWORD

# ----------------------------------------------------------
# 2️⃣ Copy dependencies and Prisma schema early (for prisma generate)
# ----------------------------------------------------------
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies safely
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# ----------------------------------------------------------
# 3️⃣ Copy the rest of the application source code
# ----------------------------------------------------------
COPY . .

# ----------------------------------------------------------
# 4️⃣ Build Next.js app (needs env vars like OPENAI_API_KEY)
# ----------------------------------------------------------
RUN npm run build

# ---- Run stage ----
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy compiled app and required files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# Install only production deps
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; else npm install --omit=dev --legacy-peer-deps; fi

# Expose app port
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start", "-p", "3000"]
