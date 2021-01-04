FROM node:12

RUN npm --loglevel=error install -g serverless && npm --loglevel=error install -g serverless-offline

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["serverless", "schedule"]