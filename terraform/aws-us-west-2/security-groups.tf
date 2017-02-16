// security group to attach to albs. Allows https from the outside world
resource "aws_security_group" "alb-sg" {
  name        = "alb-${var.name}-${var.environment}"
  description = "allow https from the outside world"
  vpc_id      = "${module.vpc.id}"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// security group to attach to asg. Allows http from alb
resource "aws_security_group" "asg-sg" {
  name        = "asg-${var.name}-${var.environment}"
  description = "allow http from ALB"
  vpc_id      = "${module.vpc.id}"

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = ["${aws_security_group.alb-sg.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
