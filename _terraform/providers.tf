terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
  # provider-level account_id was removed in v4; each resource that
  # needs it (cloudflare_zone, cloudflare_worker_script, cloudflare_r2_bucket)
  # sets account_id explicitly now.
}
