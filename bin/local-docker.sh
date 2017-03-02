#! /bin/bash

set -eux -o pipefail

readonly name=$1

docker build -t $name .

readonly old_container_id=$(docker ps -a -q -f name=${name})

if [[ ! -z $old_container_id ]]; then
    docker rm -f $old_container_id
fi
docker run -e AWS_REGION=us-east-1 -d -p 80:80 --name $name $name
