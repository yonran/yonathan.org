resource "cloudflare_record" "apex" {
  zone_id = cloudflare_zone.main.id
  type    = "A"
  name    = local.zone_name
  value   = local.gce_instance_public_ip
  proxied = true
}

resource "cloudflare_record" "google_site_verification" {
  zone_id = cloudflare_zone.main.id
  type    = "TXT"
  name    = local.zone_name
  value   = local.google_site_verification
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.main.id
  type    = "A"
  name    = "www"
  value   = local.gce_instance_public_ip
  proxied = true
}

resource "cloudflare_record" "blog" {
  zone_id = cloudflare_zone.main.id
  type    = "A"
  name    = "blog"
  value   = local.gce_instance_public_ip
  proxied = true
}

