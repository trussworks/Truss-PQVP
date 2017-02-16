FROM ubuntu:16.04

RUN apt-get update

# install PostGres with GIS extension
RUN apt-get install -y postgresql postgresql-contrib postgis nginx

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

WORKDIR /etc/nginx

CMD ["nginx"]

EXPOSE 80
