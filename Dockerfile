FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENV HOST=0.0.0.0 PORT=4000
EXPOSE 4000
CMD [ "yarn", "start" ]
