FROM node:8-alpine

EXPOSE 80
WORKDIR /app

VOLUME /app/logs

COPY ["package.json", "package-lock.json", "/app/"]
RUN npm ci --production > /dev/null

COPY web /app/web
COPY docs /app/docs

CMD [ "npm", "start", "-s" ]
