# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to working directory
COPY package*.json ./ 
# COPY yarn.lock ./

# Install dependencies and devDependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN yarn build

# Expose the port that the application listens on
EXPOSE 5173

# Start the application
CMD ["yarn", "preview"]
