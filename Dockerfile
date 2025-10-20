# Multi-stage build for production

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:18-alpine
WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm install --production

# Copy backend source
COPY server/ ./server/
COPY .env.example ./.env

# Copy built frontend from stage 1
COPY --from=frontend-build /app/client/build ./client/build

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/server.js"]
