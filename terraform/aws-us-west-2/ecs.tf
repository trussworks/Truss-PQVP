// ecs cluster and task definition
module "nginx" {
  source                   = "../modules/aws-ecs"
  name                     = "nginx"
  hostname                 = "demo"
  environment              = "${var.environment}"
  container_definitions    = "${file("task-definitions/nginx.json")}"
  ecs_role_policy          = "${file("iam-policies/ecs-role.json")}"
  ecs_instance_role_policy = "${file("iam-policies/ecs-instance-role-policy.json")}"
  ecs_service_role_policy  = "${file("iam-policies/ecs-service-role-policy.json")}"
  ecs_desired_count        = 2
  vpc_id                   = "${module.vpc.id}"
  subnet_ids               = "${module.vpc.external_subnets}"
  zone_name                = "${module.route53.zone_name}"
  s3_logs_bucket           = "${module.logs.aws_logs_bucket}"
  alb_security_group_ids   = ["${aws_security_group.alb-sg.id}"]
}
