#!/bin/bash

set -eux -o pipefail
readonly name=$1

docker pull mdillon/postgis

readonly old_postgis_id=$(docker ps -a -q -f name=${name})

if [[ ! -z $old_postgis_id ]]; then
  docker rm -f $old_postgis_id
fi

docker tag mdillon/postgis $name
docker run -d -p 5432:5432 --name $name $name
sleep 20
createdb -h localhost -p 5432 -U postgres pqvp
migrate -url "postgres://postgres@localhost:5432/pqvp?sslmode=disable" -path server/sql up
