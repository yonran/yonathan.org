resource "cloudflare_worker_script" "static_files_worker" {
  account_id = var.account_id
  name       = "static_files_worker"
  content    = file("../_cloudflare_worker/lib/static_files.js")
  r2_bucket_binding {
    name        = "MY_BUCKET"
    bucket_name = aws_s3_bucket.serving.bucket
  }
}

resource "cloudflare_worker_script" "redirect_http_to_https_worker" {
  account_id = var.account_id
  name       = "redirect_http_to_https_worker"
  content    = file("../_cloudflare_worker/lib/redirect_http_to_https.js")
}

resource "cloudflare_worker_script" "redirect_apex_to_blog" {
  account_id = var.account_id
  name       = "redirect_apex_to_blog"
  content    = file("../_cloudflare_worker/lib/redirect_apex_to_blog.js")
}
