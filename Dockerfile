FROM smebberson/alpine-nginx-nodejs
ARG app_environment=prod

WORKDIR /tmp

COPY ./src /tmp/src/
COPY ./package.json /tmp/.
COPY ./gulpfile.js /tmp/.
COPY ./config.dev.json /tmp/.
COPY ./config.test.json /tmp/.
COPY ./config.pre.json /tmp/.
COPY ./config.prod.json /tmp/.

# # Install Bower & Gulp
RUN npm config set unsafe-perm true
RUN npm install -g gulp@4.0.1

RUN npm install

RUN gulp build-$app_environment

RUN cp -R public/* /usr/html


