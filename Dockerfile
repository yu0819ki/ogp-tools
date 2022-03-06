FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY server.js ./

EXPOSE 80
CMD ["node", "server.js"]

# 開発用
FROM build as development
## auto-reload用の設定を入れる
RUN yarn install && yarn global add nodemon

COPY dev-startup.sh ./
CMD ./dev-startup.sh
