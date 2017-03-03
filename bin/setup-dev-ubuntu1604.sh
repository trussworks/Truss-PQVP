#!/bin/bash
set -eux -o pipefail

# install nodenv
git clone https://github.com/nodenv/nodenv.git ~/.nodenv
pushd ~/.nodenv
./src/configure
make -C src
popd

# setup bash profile with nodenv
echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(nodenv init -)"' >> ~/.bash_profile
source ~/.bash_profile

# install node-build
mkdir -p $(nodenv root)/plugins/
pushd $(nodenv root)/plugins/
git clone https://github.com/nodenv/node-build.git
popd

# install version of node in .node-version
nodenv install

# install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install -y yarn

# install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce

# compile client
make client_build


