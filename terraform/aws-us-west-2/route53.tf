// setup route53 subdomain for demo
module "route53" {
  source    = "../modules/aws-route53"
  zone_name = "${var.name}.truss.works"
}
