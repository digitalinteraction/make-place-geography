FROM node:7.3-alpine


RUN mkdir -p /app
WORKDIR /app


VOLUME /app/logs


COPY package.json /app/
RUN npm install --silent


COPY web /app/web


RUN node node_modules/.bin/apidoc -i web/ -o api/ --silent


CMD node node_modules/.bin/nodemon --watch web web/server.js
