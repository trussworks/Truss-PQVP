FROM golang:1.8.0

# install the following packages
# PostGres with GIS extension
RUN apt-get update && apt-get install -y \
    postgresql \
    postgresql-contrib \
    postgis

# install glide for vendoring go libs
RUN go get github.com/Masterminds/glide
# install postgres migrations tool
RUN go get github.com/mattes/migrate

RUN mkdir -p /go/src/app
WORKDIR /go/src/app
ADD . /go/src/app

# build backend binary
RUN make server_build

ENTRYPOINT /go/src/app/server/entrypoint.sh

EXPOSE 80
