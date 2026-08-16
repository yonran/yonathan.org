# Blog

This is the source for my personal blog.

## Manual setup

Create an [Account API Token](https://dash.cloudflare.com/?to=/:account/api-tokens). Under Permission policies, add 3 policies:

1. Entire account
  * Workers Scripts ☑️ Edit
  * Workers R2 Storage ☑️ Read (needed for aws_s3_bucket’s GetBucketAcl; can be removed after we switch to cloudflare_r2_bucket)
2. Specified Domains (previously Zone); select the domain.
  * DNS ☑️ Edit (cloudflare_record)
  * SSL and Certificates ☑️ Edit (cloudflare_certificate_pack)
  * Workers Routes ☑️ Edit (cloudflare_worker_route)
3. R2 Buckets: `terraform-backends`, `yonathan-static-files`
  * Workers R2 Storage Bucket Item ☑️ Edit

terraform-provider-cloudflare does not support updating
[Registrar Domains](https://api.cloudflare.com/#registrar-domains-properties)
so that has to be created using the gui.

### Secrets

[deploy.yaml](.github/workflows/deploy.yaml) depends on several secrets:

* `CLOUDFLARE_ACCOUNT_ID` Account ID from URL of dashboard or from “Account Details” in [R2 Object Storage: Overview](https://dash.cloudflare.com/?to=/:account/r2/overview)
* `CLOUDFLARE_API_TOKEN` API Token described above
* `CLOUDFLARE_R2_ACCESS_KEY_ID` and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: S3-compatible S3 Auth token described above
* `ARTIFACT_ENCRYPTION_PASSWORD`: any random password to encrypt the secret tfplan within the artifact.
I used `openssl rand -base64 32` to generate one.
