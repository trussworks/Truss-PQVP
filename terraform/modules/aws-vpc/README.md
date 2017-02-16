
## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| cidr | The CIDR block for the VPC. | - | yes |
| external_subnets | List of external subnets | - | yes |
| internal_subnets | List of internal subnets | - | yes |
| environment | Environment tag | - | yes |
| availability_zones | List of availability zones | - | yes |
| name | Name of VPC | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| id | The VPC ID |
| external_subnets | A comma-separated list of subnet IDs. |
| internal_subnets | A list of subnet IDs. |
| security_group | The default VPC security group ID. |
| availability_zones | The list of availability zones of the VPC. |
| internal_rtb_id | The internal route table ID. |
| external_rtb_id | The external route table ID. |
| internal_nat_ips | The list of EIPs associated with the internal subnets. |
| cidr | The CIDR of the VPC, for other modules to use. |

