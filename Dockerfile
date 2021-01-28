FROM lambci/lambda:build-nodejs12.x

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENTRYPOINT ["/bin/bash"]