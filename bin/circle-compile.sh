#! /bin/bash

set -eux -o pipefail

# Client build
pushd client
npm run-script prod
popd

# Generate swagger docs
bootprint openapi server/docs/swagger.yaml client/dist/docs
