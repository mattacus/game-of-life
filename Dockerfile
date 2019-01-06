## Stage 1: NPM Build ##

FROM node:9.5-alpine as build-stage

# replace shell with bash
RUN apk update && apk add bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Run install steps
RUN npm install 

# Copy app source
COPY . .

# Build production
RUN npm run build:prod


## Stage 2: nginx Setup ##

FROM nginx:1.14.1-alpine

# Copy nginx config, remove any default files
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy over build artifacts to nginx server location
COPY --from=build-stage /usr/src/app/dist/ /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]