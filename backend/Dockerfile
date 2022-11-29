FROM node:16-alpine3.14

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY libs ./libs
COPY src ./src

RUN yarn build

ENTRYPOINT ["yarn", "start:prod"]
