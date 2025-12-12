

# Use official Node image
FROM node:18

# Create app directory inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server using the "start" script in package.json
CMD ["npm", "start"]
