resource "cloudflare_r2_bucket" "serving" {
  account_id = var.account_id
  name       = local.bucket_name
}
