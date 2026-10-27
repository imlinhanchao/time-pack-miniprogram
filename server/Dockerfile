# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the project
RUN pnpm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install production dependencies only
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod

# Copy compiled files and assets from builder
COPY --from=builder /app/dist ./dist

# Create upload directory
RUN mkdir -p dist/public/upload

EXPOSE 3000

CMD ["node", "dist/index.js"]
