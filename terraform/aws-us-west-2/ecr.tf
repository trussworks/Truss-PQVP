// add a single EC2 Container Registry(ECR) to host docker images
resource "aws_ecr_repository" "ecr" {
  name = "${var.name}-${var.environment}"
}
