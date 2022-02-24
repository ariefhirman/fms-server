FROM node:14-alpine

WORKDIR /panasonic-backend
COPY package.json .
RUN npm install .
COPY . .
CMD npm run start