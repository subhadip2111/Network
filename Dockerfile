# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Create .env file from build args
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG PORT=4040
ENV PORT=${PORT}

EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]