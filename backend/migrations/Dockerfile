FROM node:16

WORKDIR /app

COPY package.json .
COPY createTables.js .

RUN npm install

CMD ["node", "createTables.js"]