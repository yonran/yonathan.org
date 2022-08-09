variable "account_id" {
  type      = string
  sensitive = true
}
variable "backend_access_key_id" {
  type = string
}
variable "backend_secret_access_key" {
  type      = string
  sensitive = true
}
variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}
locals {
  zone_name                = "yonathan.org"
  main_subdomain           = "blog.${local.zone_name}"
  bucket_name              = "yonathan-static-files"
  gce_instance_public_ip   = "104.198.15.122"
  google_site_verification = "google-site-verification=fLD7TABrwc_PxsLyAYvu2Re5HAaDGDIEjBWgcwHhRZk"
}
