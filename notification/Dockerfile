FROM node:alpine

WORKDIR /app/notification

COPY package.json .

RUN  npm install

COPY . .

EXPOSE 9000

CMD [ "npm","start" ]