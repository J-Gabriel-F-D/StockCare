FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm run prisma:generate

CMD ["npm", "run", "dev"]
