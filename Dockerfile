FROM golang:1.8.0

# add yarn repo
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# add repo for Node.js
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -

# install the following packages
# PostGres with GIS extension
# yarn
RUN apt-get update && apt-get install -y \
    postgresql \
    postgresql-contrib \
    postgis \
    yarn

RUN mkdir -p /go/src/app
WORKDIR /go/src/app
ADD . /go/src/app

# build backend binary
RUN go get -u github.com/zenazn/goji
RUN make

# package frontend files
WORKDIR /go/src/app/client
RUN yarn install
RUN npm run-script prod

ENTRYPOINT /go/src/app/server/server -entry /go/src/app/client/dist/index.html -static /go/src/app/client/dist/

EXPOSE 80
