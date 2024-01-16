FROM node:alpine

WORKDIR /app/posts

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7000

CMD [ "npm","start" ]