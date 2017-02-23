#! /bin/bash

set -eux -o pipefail

# Client build
pushd client
npm run-script prod
popd
