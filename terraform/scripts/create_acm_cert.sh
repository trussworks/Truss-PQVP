#!/bin/bash

# creates a new cert using LetsEncrypt and uploads it to Amazon Certificate
# Manager(ACM) to be used by Applicate Load Balancers(ALB).

readonly usage="Usage: ${0} <domain_name>"
test -n "${1}" || { echo "${usage}"; exit 1; }

: "${AWS_REGION:?"must be set."}"

set -eux -o pipefail
readonly domain_name="${1}"

# Check if go is installed. We use lego for Let's Encrypt certs
command -v go >/dev/null 2>&1 || { echo >&2 "Functioning golang environment required. Aborting."; exit 1; }

# Download the lego binary
go get -u github.com/xenolf/lego

# Make the certs directory to store
mkdir -p ../certs/

# Generate new certs using LetsEncrypt
# Validate certs using Route53
lego --email="dynamike@truss.works" \
     --path="../certs" \
     --dns="route53" \
     --domains="${domain_name}" \
     run

set +x
# Import new certs into Amazon Certificate Manager
aws acm import-certificate \
    --region="${AWS_REGION}" \
    --certificate "$(openssl x509 -in ../certs/certificates/"${domain_name}".crt)" \
    --private-key "file://../certs/certificates/${domain_name}.key" \
    --certificate-chain "$(openssl crl2pkcs7 -nocrl -certfile ../certs/certificates/"${domain_name}".crt | openssl pkcs7 -print_certs)"
set -x
