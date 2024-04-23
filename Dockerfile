FROM node:20-alpine

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

RUN npm run build

CMD ["node", "dist/src/index.js"]