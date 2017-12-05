FROM node:8-alpine

EXPOSE 80
WORKDIR /app

VOLUME /app/logs

COPY package.json /app
RUN npm install --silent --production

COPY web /app/web
COPY docs /app/docs

CMD npm start
