#! /bin/bash

set -eux -o pipefail


# Get go environment setup
rm -rf ~/.go_workspace/src/github.com/mattes
go get github.com/Masterminds/glide
go get github.com/mattes/migrate
pushd server
glide install
popd

# cp -R server/vendor/* ~/.go_workspace/src/

# Install client deps
pushd client
yarn install
popd

# swagger doc generation dependencies
yarn global add bootprint
yarn global add bootprint-openapi

# Pull down and install terraform to run tests
sudo wget https://releases.hashicorp.com/terraform/0.8.6/terraform_0.8.6_linux_amd64.zip -O /usr/local/bin/terraform.zip
pushd /usr/local/bin
sudo unzip terraform.zip
popd

# Clone ecs-deploy so we can push task updates to ECS once tests past
git clone https://github.com/silinternational/ecs-deploy.git

# Pull down Sauce Labs Connect
# FIXME: disabled due to Sauce just not working. --mark
# - wget https://saucelabs.com/downloads/sc-latest-linux.tar.gz
# tar -xzf sc-latest-linux.tar.gz
