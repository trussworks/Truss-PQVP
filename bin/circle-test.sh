#! /bin/bash

set -eux -o pipefail
# Run validation checks against all of the terraform files
terraform/scripts/run_tests.sh

createdb pqvp
migrate -url "postgres://postgres@localhost:5432/pqvp?sslmode=disable" -path server/sql up

# Run backend server tests
make server_test

# Basic test that we can run and curl a local container with the latest image
docker run -d -p 80:80 pqvp-demo:latest; sleep 10
curl -sSf --retry 10 --retry-delay 5 localhost:80

# Run client tests
pushd client
npm run-script test
popd

