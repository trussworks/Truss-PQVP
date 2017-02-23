#! /bin/bash

set -eux -o pipefail

# Get credentials to access the container registry
eval $(aws ecr get-login --region $AWS_DEFAULT_REGION)

# Tag and push the latest image
docker tag pqvp-demo:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/pqvp-demo:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/pqvp-demo:latest
# Deploy latest docker image to ECS cluster
ecs-deploy/ecs-deploy -c ecs-pqvp-demo -n pqvp -t 300 -i ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/pqvp-demo:latest
