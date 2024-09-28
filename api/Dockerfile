FROM node:18-alpine as build
WORKDIR /usr/app
COPY . /usr/app
RUN npm install
RUN npm install pm2 -g

RUN chmod -R 777 /usr/app/public

EXPOSE 5508

CMD ["pm2-runtime","start","./src/app.js"]
