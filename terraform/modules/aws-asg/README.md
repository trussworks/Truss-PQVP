
## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| name | The cluster name, e.g apps | - | yes |
| environment | Environment tag, e.g prod | - | yes |
| image_id | AMI Image ID | - | yes |
| subnet_ids | List of subnet IDs | - | yes |
| key_name | SSH key name to use | - | yes |
| availability_zones | List of AZs | - | yes |
| instance_type | The instance type to use, e.g t2.small | - | yes |
| min_size | Minimum instance count | `1` | no |
| max_size | Maxmimum instance count | `1` | no |
| desired_capacity | Desired instance count | `1` | no |
| root_volume_size | Root volume size in GB | `25` | no |
| associate_public_ip_address | Should created instances be publicly accessible (if the SG allows) | `false` | no |
| user_data | User data string to pass into the EC2 instances | - | yes |
| iam_instance_profile | IAM instance profile to attach to EC2 instances | - | yes |

