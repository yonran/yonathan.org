resource "cloudflare_worker_route" "static_files_worker" {
  zone_id     = cloudflare_zone.main.id
  pattern     = "https://${local.main_subdomain}/staging/*"
  script_name = cloudflare_worker_script.static_files_worker.name
}

// I think you could do this with a URL Transform Rule,
// but terraform-provider-cloudflare as of 3.20.0
// does not support creating Transform Rules
resource "cloudflare_worker_route" "redirect_http_to_https_worker" {
  zone_id     = cloudflare_zone.main.id
  pattern     = "http://*${local.zone_name}/staging/*"
  script_name = cloudflare_worker_script.redirect_http_to_https_worker.name
}

// I think you could do this with a URL Transform Rule,
// but terraform-provider-cloudflare as of 3.20.0
// does not support creating Transform Rules
resource "cloudflare_worker_route" "redirect_apex_to_blog" {
  zone_id     = cloudflare_zone.main.id
  pattern     = "https://*${local.zone_name}/staging/*"
  script_name = cloudflare_worker_script.redirect_apex_to_blog.name
}
