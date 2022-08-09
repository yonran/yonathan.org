# don't import the certificate pack,
# since as of terraform-provider-cloudflare 3.20,
# it does not support type = "universal"
# resource "cloudflare_certificate_pack" "main" {
#   zone_id = cloudflare_zone.main.id
#   hosts = ["yonathan.org", "*.yonathan.org"]
#   type = "universal"
#   validation_method = "txt"
#   validity_days = "365"
#   certificate_authority = "google"
# }
