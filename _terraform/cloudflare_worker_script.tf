resource "cloudflare_worker_script" "static_files_worker" {
  name = "static_files_worker"
  # cloudflare_worker_script 3.20.0 requires account_id
  # but does not yet support it in cloudflare_worker_script
  # (it is set in the provider instead)
  content = file("../_cloudflare_worker/lib/static_files.js")
  r2_bucket_binding {
    name        = "MY_BUCKET"
    bucket_name = aws_s3_bucket.serving.bucket
  }
}

resource "cloudflare_worker_script" "redirect_http_to_https_worker" {
  name = "redirect_http_to_https_worker"
  # cloudflare_worker_script 3.20.0 requires account_id
  # but does not yet support it in cloudflare_worker_script
  # (it is set in the provider instead)
  content = file("../_cloudflare_worker/lib/redirect_http_to_https.js")
}

resource "cloudflare_worker_script" "redirect_apex_to_blog" {
  name = "redirect_apex_to_blog"
  # cloudflare_worker_script 3.20.0 requires account_id
  # but does not yet support it in cloudflare_worker_script
  # (it is set in the provider instead)
  content = file("../_cloudflare_worker/lib/redirect_apex_to_blog.js")
}
