FROM node:12

RUN npm --loglevel=error install -g serverless && npm --loglevel=error install -g serverless-offline

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./scripts/wait-for-it.sh ./

RUN ["chmod", "+x", "/usr/src/app/wait-for-it.sh"]

RUN npm install

COPY . .

EXPOSE 3000