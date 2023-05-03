FROM node:lts

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install
COPY . .

ARG ARG=environment
RUN if [ "$ENVIRONMENT" = "dockerized" ]; \
      then cp .env.dockerized .env; \
    fi

RUN yarn format
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]