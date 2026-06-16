FROM node:18-alpine
WORKDIR /usr/src/app

RUN npm install express cors pg

COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]