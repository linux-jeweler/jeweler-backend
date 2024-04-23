FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy

EXPOSE 3001

RUN npm run build

CMD ["node", "dist/src/index.js"]