FROM node:lts

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install
COPY . .

RUN pwd
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]