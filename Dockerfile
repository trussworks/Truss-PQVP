FROM ubuntu:16.04

RUN apt-get update

# install PostGres with GIS extension
RUN apt-get install -y postgresql postgresql-contrib postgis nginx

CMD ["nginx"]

EXPOSE 80
