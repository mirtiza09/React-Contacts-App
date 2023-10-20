FROM node:18.16.1-alpine3.18

RUN mkdir -p /app
WORKDIR /app

# Install Tailwind CSS globally
RUN npm install -g tailwindcss

EXPOSE 3000
CMD echo 1; npm install; echo 2; npm run start