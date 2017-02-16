## DNS

This module creates a Route 53 hosted zone, which will give us NS and SOA records to point our registrar to.

## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| zone_name | The zone name e.g demo.truss.works | - | yes |
| main_a_record | The A record for the top entry | 10.0.0.1 | no |

## Outputs

| Name | Description |
|------|-------------|
| zone_id | The zone ID of the zone we created|

