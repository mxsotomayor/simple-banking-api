# Use the official Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose the port your app runs on
EXPOSE 9001

# Start the app
CMD [ "npm", "start" ]