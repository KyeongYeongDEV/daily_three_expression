FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist
COPY .env .env

CMD ["node", "dist/main"]
