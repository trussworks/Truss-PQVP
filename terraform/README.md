## Initial Setup

### Install Terraform
```
brew update
brew install terraform
```

### Remote state
```
./configure-remote-state.sh
```
Terraform remote state is stored on S3. Run `configure-remote-state.sh` to terraform to read/write to the statefile on S3.

## VPCs
* Name: truss-pqvp-demo
* VPC CIDR: 10.40.0.0/16

| Subnet Name             | Availability Zone | CIDR           |
|-------------------------|-------------------|----------------|
| uscis-demo-internal-001 |     us-west-2a    | 10.40.0.0/19   |
| uscis-demo-internal-002 |     us-west-2b    | 10.40.64.0/19  |
| uscis-demo-external-001 |     us-west-2a    | 10.40.32.0/20  |
| uscis-demo-external-002 |     us-west-2b    | 10.40.96.0/20  |
