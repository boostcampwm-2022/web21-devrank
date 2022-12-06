FROM node:16-alpine3.14

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "build", "&&", "yarn", "start"]
