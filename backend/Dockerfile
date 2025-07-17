FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

ENV DATABASE_URL="postgresql://stockcare:stockcare123@db:5432/stockcare"

RUN npm run prisma:generate

CMD ["npm", "run", "dev"]
