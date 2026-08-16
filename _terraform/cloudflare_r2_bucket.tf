resource "aws_s3_bucket" "serving" {
  provider = aws.cloudflare_r2
  bucket   = local.bucket_name
}

resource "cloudflare_r2_bucket" "serving" {
  account_id = var.account_id
  name       = local.bucket_name
}
