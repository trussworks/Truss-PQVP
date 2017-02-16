variable "name" {
  description = "The service name"
}

variable "container_definitions" {
  description = "JSON formatted string describing how to run the container"
  type        = "string"
}

variable "environment" {
  description = "Environment tag, e.g prod"
}

variable "ecs_role_policy" {
  description = "Assume role IAM policy ECS role"
}

variable "ecs_instance_role_policy" {
  description = "IAM policy for ECS Instances"
}

variable "ecs_service_role_policy" {
  description = "IAM policy for ECS service"
}

variable "ecs_desired_count" {
  description = "the number of instances of a task definition"
  default     = 1
}

variable "vpc_id" {
  description = "VPC ID to be used by the ALB"
}

variable "subnet_ids" {
  description = "Subnets IDs for the ALB"
  type        = "list"
}

variable "zone_name" {
  description = "Route53 zone name"
}

variable "hostname" {
  description = "Route53 record to create"
}

variable "s3_logs_bucket" {
  description = "S3 bucket for storing Application Load Balancer logs"
}

variable "alb_security_group_ids" {
  description = "Security Group IDs to assign to the ALB"
  type        = "list"
}

data "aws_route53_zone" "main" {
  name = "${var.zone_name}"
}

data "aws_acm_certificate" "main" {
  domain   = "${var.hostname}.${var.zone_name}"
  statuses = ["ISSUED"]
}

/*
 IAM
*/
resource "aws_iam_role" "ecs_host_role" {
  name               = "ecs-role-${var.name}-${var.environment}"
  assume_role_policy = "${var.ecs_role_policy}"
}

resource "aws_iam_role_policy" "ecs_instance_role_policy" {
  name   = "ecs-instance-role-policy-${var.name}-${var.environment}"
  policy = "${var.ecs_instance_role_policy}"
  role   = "${aws_iam_role.ecs_host_role.id}"
}

resource "aws_iam_role" "ecs_service_role" {
  name               = "ecs-service-role-${var.name}-${var.environment}"
  assume_role_policy = "${var.ecs_role_policy}"
}

resource "aws_iam_role_policy" "ecs_service_role_policy" {
  name   = "ecs-service-role-policy-${var.name}-${var.environment}"
  policy = "${var.ecs_service_role_policy}"
  role   = "${aws_iam_role.ecs_service_role.id}"
}

resource "aws_iam_instance_profile" "ecs_profile" {
  name  = "ecs-instance-profile-${var.name}-${var.environment}"
  path  = "/"
  roles = ["${aws_iam_role.ecs_host_role.name}"]
}

/*
 ECS
*/
resource "aws_ecs_task_definition" "main" {
  family                = "${var.name}"
  container_definitions = "${var.container_definitions}"
}

resource "aws_ecs_service" "main" {
  name            = "${var.name}"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.main.arn}"
  desired_count   = "${var.ecs_desired_count}"
  iam_role        = "${aws_iam_role.ecs_service_role.arn}"

  load_balancer {
    target_group_arn = "${aws_alb_target_group.main.id}"
    container_name   = "${aws_ecs_task_definition.main.family}"
    container_port   = 80
  }
}

resource "aws_ecs_cluster" "main" {
  name = "ecs-${var.name}-${var.environment}"

  lifecycle {
    create_before_destroy = true
  }
}

/*
 ALB
*/
resource "aws_alb_target_group" "main" {
  name     = "target-${var.name}-${var.environment}"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "${var.vpc_id}"
}

resource "aws_alb" "main" {
  name            = "${var.name}-${var.environment}"
  subnets         = ["${var.subnet_ids}"]
  security_groups = ["${var.alb_security_group_ids}"]

  access_logs {
    enabled = true
    bucket  = "${var.s3_logs_bucket}"
    prefix  = "alb"
  }
}

resource "aws_alb_listener" "main" {
  load_balancer_arn = "${aws_alb.main.id}"
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = "${data.aws_acm_certificate.main.arn}"

  default_action {
    target_group_arn = "${aws_alb_target_group.main.id}"
    type             = "forward"
  }
}

/*
 Route53
*/
resource "aws_route53_record" "main" {
  zone_id = "${data.aws_route53_zone.main.zone_id}"
  name    = "${var.hostname}.${var.zone_name}"
  type    = "A"

  alias {
    name                   = "${aws_alb.main.dns_name}"
    zone_id                = "${aws_alb.main.zone_id}"
    evaluate_target_health = false
  }
}

/*
 CloudWatch
*/
resource "aws_cloudwatch_log_group" "main" {
  name = "ecs-tasks-${var.name}-${var.environment}"

  tags {
    Name        = "${var.name}"
    Environment = "${var.environment}"
  }
}

// Name of the ECS cluster
output "ecs_cluster_name" {
  value = "${aws_ecs_cluster.main.name}"
}

// Name of the IAM instance profile
output "ecs_instance_profile_name" {
  value = "${aws_iam_instance_profile.ecs_profile.name}"
}
