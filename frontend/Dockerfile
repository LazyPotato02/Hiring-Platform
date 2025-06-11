# src/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY ./src /app

RUN npm install && npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]