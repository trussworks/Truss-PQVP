variable "zone_name" {
  description = "The DNS zone that we are creating e.g. demo.truss.works"
}

resource "aws_route53_zone" "main" {
  name = "${var.zone_name}"
}

// The id of the zone that we create
output "zone_id" {
  value = "${aws_route53_zone.main.zone_id}"
}

// The name of the zone e.g. demo.truss.works
output "zone_name" {
  value = "${var.zone_name}"
}
