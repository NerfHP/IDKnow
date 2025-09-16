# Stage 1: Build the application
# This stage installs all dependencies (including dev) and compiles the TypeScript
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
RUN npm exec prisma generate

# Compile TypeScript to JavaScript
RUN npm run build


# Stage 2: Create the final production image
# This stage creates a smaller, cleaner image for running the application
FROM node:20-slim
WORKDIR /usr/src/app

# Copy package files and install *only* production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# THE FIX IS HERE: Copy the compiled 'dist' folder from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the Prisma schema for the runtime
COPY prisma ./prisma

# Expose the port your app runs on
EXPOSE 10000

# The command to start the application
CMD ["npm", "run", "start"]
