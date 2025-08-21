FROM node:18

WORKDIR /usr/app/

COPY *.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm" ,"run","dev" ]