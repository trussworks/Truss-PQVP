#! /bin/bash

set -eux -o pipefail

# Enable Docker image caching to speed up builds
if [[ -e ~/docker/image.tar ]]; then
    docker load -i ~/docker/image.tar
fi
docker build --rm=false -t pqvp-demo:latest .
mkdir -p ~/docker; docker save pqvp-demo:latest > ~/docker/image.tar

# Pull down and install terraform to run tests
sudo wget https://releases.hashicorp.com/terraform/0.8.6/terraform_0.8.6_linux_amd64.zip -O /usr/local/bin/terraform.zip
pushd /usr/local/bin
sudo unzip terraform.zip
popd

# Clone ecs-deploy so we can push task updates to ECS once tests past
git clone https://github.com/silinternational/ecs-deploy.git

# Install client deps
pushd client
yarn install
popd

# Pull down Sauce Labs Connect
# FIXME: disabled due to Sauce just not working. --mark
# - wget https://saucelabs.com/downloads/sc-latest-linux.tar.gz
# tar -xzf sc-latest-linux.tar.gz
