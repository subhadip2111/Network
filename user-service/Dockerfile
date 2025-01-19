# filepath: /home/subhadip/Personal/project/user-service/Dockerfile
# Base image
FROM node:18.17.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY src/ ./src

# Expose the port the service runs on
EXPOSE 3001

# Set environment variables

# Command to run the app
CMD ["node", "src/server.js"]