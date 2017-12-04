FROM node:8-alpine

EXPOSE 3000
WORKDIR /app

COPY package.json /app
RUN npm install --silent --production

COPY web /app/web

CMD node web
