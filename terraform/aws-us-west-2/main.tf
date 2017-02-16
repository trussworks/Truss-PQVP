// creates a vpc across 2 availability zones with an internal and external
// subnet in each AZ
module "vpc-truss-pqvp" {
  source             = "../modules/aws-vpc"
  name               = "truss-pqvp"
  cidr               = "10.40.0.0/16"
  internal_subnets   = ["10.40.0.0/19", "10.40.64.0/19"]
  external_subnets   = ["10.40.32.0/20", "10.40.96.0/20"]
  availability_zones = ["us-west-2a", "us-west-2b"]
  environment        = "demo"
}
