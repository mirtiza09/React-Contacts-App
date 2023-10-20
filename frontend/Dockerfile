# Base image
FROM node:18.16.1-alpine3.18

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies by copying package files and installing
COPY package*.json ./
RUN npm install

# Copy all files into container (after npm install to optimize caching)
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# CMD to run the app
CMD ["npm", "start"]
