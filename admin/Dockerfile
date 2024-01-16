FROM node:alpine

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7300

CMD [ "npm","start" ]