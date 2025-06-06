FROM node:18

ENV NODE_OPTIONS="--experimental-global-webcrypto"

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# 🔽 전체 소스 복사
COPY . .

# 🔽 Nest 빌드 실행 (nest-cli.json 기준으로 asset 복사 포함)
RUN npm run build

# 🔽 환경변수 복사
COPY .env .env

CMD ["node", "dist/main"]
