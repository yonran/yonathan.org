resource "aws_s3_bucket" "serving" {
  provider = aws.cloudflare_r2
  bucket   = local.bucket_name
}
