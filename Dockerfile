FROM golang:1.8.0

# install PostGres with GIS extension
RUN apt-get update && apt-get install -y postgresql postgresql-contrib postgis

RUN mkdir -p /go/src/app
WORKDIR /go/src/app
ADD . /go/src/app

RUN go get -u github.com/zenazn/goji
RUN make

ENTRYPOINT /go/src/app/server/server -entry /go/src/app/client/public/index.html

EXPOSE 80
