// asg dedicated to ecs
module "asg" {
  source                      = "../modules/aws-asg"
  name                        = "asg-${var.name}-${var.environment}"
  image_id                    = "ami-022b9262"
  security_group_ids          = ["${aws_security_group.asg-sg.id}"]
  availability_zones          = "${module.vpc.availability_zones}"
  subnet_ids                  = "${module.vpc.internal_subnets}"
  instance_type               = "t2.small"
  environment                 = "${var.environment}"
  key_name                    = "dynamike"
  associate_public_ip_address = false
  min_size                    = 2
  max_size                    = 2
  desired_capacity            = 2
  iam_instance_profile        = "${module.nginx.ecs_instance_profile_name}"

  user_data = <<EOF
#!/bin/bash
echo "ECS_CLUSTER=${module.nginx.ecs_cluster_name}" >> /etc/ecs/ecs.config
echo 'ECS_AVAILABLE_LOGGING_DRIVERS=["json-file","awslogs"]' >> /etc/ecs/ecs.config
EOF
}
