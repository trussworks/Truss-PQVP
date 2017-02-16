#!/usr/bin/env bash
set -eux -o pipefail

terraform remote config -backend=s3 \
  -backend-config="bucket=truss-pqvp-terraform-state" \
  -backend-config="key=aws-us-west-2/terraform.tfstate" \
  -backend-config="region=us-west-2" \
  -backend-config="encrypt=true"
