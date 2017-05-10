FROM node:7.9-alpine


EXPOSE 80


RUN mkdir -p /app
WORKDIR /app


VOLUME /app/logs


COPY package.json /app/
RUN npm install --silent


COPY web /app/web


RUN node node_modules/.bin/apidoc -i web/ -o docs/ --silent


CMD node node_modules/.bin/nodemon --watch web --harmony-async-await web/server.js
