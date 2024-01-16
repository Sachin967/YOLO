FROM node:alpine

WORKDIR /app/users

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7100

CMD [ "npm","start" ]