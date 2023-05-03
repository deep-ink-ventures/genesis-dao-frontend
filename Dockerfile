FROM node:lts

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install
COPY . .

ARG ENVIRONMENT
RUN if [ "$ENVIRONMENT" = "dockerized" ]; \
      then sed -i "" "s,wss://node.genesis.dao.org,ws://chain:9944,g" src/config/index.ts && sed -i "" "s,https://service.genesis.dao.org,http://app:8000,g" src/config/index.ts\
    fi

RUN yarn format
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]