# Blog

This is the source for my personal blog.

## Manual setup

Create an [Account API Token](https://dash.cloudflare.com/?to=/:account/api-tokens). Under Permission policies, add 3 policies:

1. Entire account
  * Workers Scripts ☑️ Edit
  * Workers R2 Storage ☑️ Read (needed for cloudflare_r2_bucket’s read, `GET /accounts/{account_id}/r2/buckets/{bucket_name}`.
    Per the [R2 API tokens docs](https://developers.cloudflare.com/r2/api/tokens/), this is the only permission that
    covers “list buckets and view bucket configuration” — there is no bucket-scoped equivalent; the bucket-scoped
    “Workers R2 Storage Bucket Item” policy below is object-level only and does not cover it, confirmed empirically
    by removing this permission and watching `cloudflare_r2_bucket` reads fail. This does mean the token can read/list
    objects in every R2 bucket on the account, not just the ones below — there’s no way to scope it down further.)
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

[deploy.yaml](.github/workflows/deploy.yaml) depends on several secrets. They must be **repository** secrets,
not environment secrets: `terraform-plan` runs unscoped (no `environment:`, since it runs on every push/PR
with no approval gate) and needs the same full credentials as `terraform-apply` to do a real `terraform init`/`plan`
against the real R2-backed state - there's no narrower "plan-only" credential to split out, so the secret has
to be repo-scoped for `terraform-plan` to see it at all. Scoping a copy to the `production` environment on top
of that adds no protection, since the same values are already required to be readable outside the environment
gate. (The `production` environment's actual value is the required-reviewer approval gate and the
branch-restricted-to-`master` deployment policy on `terraform-apply`/`sync-r2-objects` - i.e. controlling *when*
apply is allowed to run, not *what* can read the credentials. Confirmed the plain `pull_request` trigger this repo
uses, unlike `pull_request_target`, does not expose secrets - repo or environment scoped - to workflow runs from
forked PRs at all, so repo-scoping these is safe against that class of attack.)

* `CLOUDFLARE_ACCOUNT_ID` Account ID from URL of dashboard or from “Account Details” in [R2 Object Storage: Overview](https://dash.cloudflare.com/?to=/:account/r2/overview)
* `CLOUDFLARE_API_TOKEN` API Token described above
* `CLOUDFLARE_R2_ACCESS_KEY_ID` and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`: S3-compatible S3 Auth token described above
* `ARTIFACT_ENCRYPTION_PASSWORD`: any random password to encrypt the secret tfplan within the artifact.
I used `openssl rand -base64 32` to generate one.
