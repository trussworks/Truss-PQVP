// enable alb logs to write to an s3 bucket
module "logs" {
  source = "../modules/aws-logs"

  // V2 ELBs are called ALBs
  elb_logs_prefix   = "alb"
  enable_cloudtrail = false
  s3_bucket_name    = "${var.name}-aws-logs"
  region            = "${var.region}"
  expiration        = 90
}
