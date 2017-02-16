variable "name" {
  description = "The cluster name"
}

variable "environment" {
  description = "Environment tag"
}

variable "image_id" {
  description = "AMI Image ID"
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = "list"
}

variable "key_name" {
  description = "SSH key name to use"
}

variable "availability_zones" {
  description = "List of AZs"
  type        = "list"
}

variable "instance_type" {
  description = "The instance type to use"
}

variable "min_size" {
  description = "Minimum instance count"
  default     = 1
}

variable "max_size" {
  description = "Maxmimum instance count"
  default     = 1
}

variable "desired_capacity" {
  description = "Desired instance count"
  default     = 1
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  default     = 25
}

variable "associate_public_ip_address" {
  description = "Assign public IP address"
  default     = false
}

variable "user_data" {
  description = "User data string to pass into the EC2 instances"
}

variable "iam_instance_profile" {
  description = "IAM instance profile to attach to EC2 instances"
}

variable "security_group_ids" {
  description = "List of security group IDs to attach to the EC2 instances"
  type        = "list"
}

resource "aws_autoscaling_group" "main" {
  name                 = "${var.name}"
  availability_zones   = ["${var.availability_zones}"]
  vpc_zone_identifier  = ["${var.subnet_ids}"]
  launch_configuration = "${aws_launch_configuration.main.id}"
  min_size             = "${var.min_size}"
  max_size             = "${var.max_size}"
  desired_capacity     = "${var.desired_capacity}"
  termination_policies = ["OldestLaunchConfiguration", "Default"]

  tag {
    key                 = "Name"
    value               = "${var.name}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Cluster"
    value               = "${var.name}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Environment"
    value               = "${var.environment}"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_launch_configuration" "main" {
  name_prefix                 = "${format("%s-", var.name)}"
  image_id                    = "${var.image_id}"
  instance_type               = "${var.instance_type}"
  key_name                    = "${var.key_name}"
  iam_instance_profile        = "${var.iam_instance_profile}"
  security_groups             = ["${var.security_group_ids}"]
  associate_public_ip_address = "${var.associate_public_ip_address}"
  user_data                   = "${var.user_data}"

  # root
  root_block_device {
    volume_type = "gp2"
    volume_size = "${var.root_volume_size}"
  }

  lifecycle {
    create_before_destroy = true
  }
}
