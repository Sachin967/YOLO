FROM node:alpine

WORKDIR /app/messaging

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm","start" ]