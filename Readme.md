# Blog

This is the source for my personal blog.

## Manual setup

[Purchase R2](https://developers.cloudflare.com/r2/get-started/#purchase-r2):
Within `https://dash.cloudflare.com/<ACCOUNT_ID>/r2/plans`,
Under “Get started with R2”, click “Purchase R2 Plan”.

[Generate an S3 Auth token](https://developers.cloudflare.com/r2/platform/s3-compatibility/tokens/):
Within `https://dash.cloudflare.com/<ACCOUNT_ID>/r2/api-tokens`,
click “Create API token”.

Generate an API Token: within [profile api tokens](https://dash.cloudflare.com/profile/api-tokens),
create an api token with permissions:

* Account; Workers Scripts; Edit. (cloudflare_worker_script)
* Zone; DNS; Edit. (cloudflare_record)
* Zone; SSL and Certificates; Edit. (cloudflare_certificate_pack)
* Zone; Workers Routes; Edit. (cloudflare_worker_route)

terraform-provider-cloudflare does not support updating
[Registrar Domains](https://api.cloudflare.com/#registrar-domains-properties)
so that has to be created using the gui.

### Secrets

[deploy.yaml](.github/workflows/deploy.yaml) depends on several secrets:

* `CLOUDFLARE_ACCOUNT_ID`
* `CLOUDFLARE_API_TOKEN` API Token described above
* `CLOUDFLARE_R2_ACCESS_KEY_ID` and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: S3-compatible S3 Auth token described above
* `ARTIFACT_ENCRYPTION_PASSWORD`: any random password to encrypt the secret tfplan within the artifact.
I used `openssl rand -base64 32` to generate one.
