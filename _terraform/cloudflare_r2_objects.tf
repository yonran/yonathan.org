
module "serving_files" {
  source = "hashicorp/dir/template"

  base_dir = "${path.module}/../_site"
  template_vars = {
  }
}

resource "aws_s3_object" "static_files" {
  provider = aws.cloudflare_r2
  for_each = module.serving_files.files

  bucket       = aws_s3_bucket.serving.bucket
  key          = each.key
  content_type = each.value.content_type

  # The serving_files module guarantees that only one of these two attributes
  # will be set for each file, depending on whether it is an in-memory template
  # rendering result or a static file on disk.
  source  = each.value.source_path
  content = each.value.content

  # Unless the bucket has encryption enabled, the ETag of each object is an
  # MD5 hash of that object.
  etag = each.value.digests.md5
}


# resource "aws_s3_object" "html_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.html")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "text/html; charset=utf-8"
# }

# resource "aws_s3_object" "js_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.js")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "text/javascript; charset=utf-8"
# }

# resource "aws_s3_object" "css_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.css")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "text/css; charset=utf-8"
# }

# resource "aws_s3_object" "svg_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.svg")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "image/svg+xml; charset=utf-8"
# }

# resource "aws_s3_object" "png_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.png")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "image/png"
# }

# resource "aws_s3_object" "jpeg_files" {
#     for_each = fileset("${path.module}/../_site", "**/*.jpg")
#     provider = aws.cloudflare_r2
#     bucket = aws_s3_bucket.serving.bucket
#     key = each.value
#     source = "${path.module}/../_site/${each.value}"
#     content_type = "image/jepg"
# }
