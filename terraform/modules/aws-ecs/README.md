
## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| name | The service name | - | yes |
| container_definitions | JSON formatted string describing how to run the container | - | yes |
| environment | Environment tag, e.g prod | - | yes |
| ecs_role_policy | Assume role IAM policy ECS role | - | yes |
| ecs_instance_role_policy | IAM policy for ECS Instances | - | yes |
| ecs_service_role_policy | IAM policy for ECS service | - | yes |
| ecs_desired_count | the number of instances of a task definition | `1` | no |
| vpc_id | VPC ID to be used by the ALB | - | yes |
| subnet_ids | Subnets IDs for the ALB | - | yes |
| zone_name | Route53 zone name | - | yes |
| hostname | Route53 record to create | - | yes |
| s3_logs_bucket | S3 bucket for storing Application Load Balancer logs | - | yes |
| alb_security_group_ids | Security Group IDs to assign to the ALB | - | yes |
| minimum_healthy_percent | lower limit on the number of running tasks | `100` | no |
| maximum_percent | upper limit on the number of running tasks | `200` | no |

## Outputs

| Name | Description |
|------|-------------|
| ecs_cluster_name | Name of the ECS cluster |
| ecs_instance_profile_name | Name of the IAM instance profile |

