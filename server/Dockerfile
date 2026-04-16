# Using official Nodejs image
FROM node:24-alpine

# set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 3001

CMD ["npm", "start"]