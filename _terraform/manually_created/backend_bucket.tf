variable "account_id" {
    type = string
    sensitive = true
}
variable "backend_access_key_id" {
    type = string
}
variable "backend_secret_access_key" {
    type = string
    sensitive = true
}
provider "aws" {
  access_key = var.backend_access_key_id
  secret_key = var.backend_secret_access_key
   # https://developers.cloudflare.com/r2/platform/s3-compatibility/api/#bucket-region
  region = "auto"
  # fix error validating provider credentials: error calling sts:GetCallerIdentity
  # … lookup sts.auto.amazonaws.com on …: no such host
  skip_credentials_validation = true
  # fix Error: Invalid AWS Region: auto
  skip_region_validation = true
  # fix error retrieving account details: AWS account ID not previously found
  # and failed retrieving via all available methods.
  # caused by iam:ListRoles to iam.amazonaws.com
  # and sts:GetCallerIdentity to sts.auto.amazonaws.com
  skip_requesting_account_id = true
  # skip loading instance profile credentials from 169.254.169.254
  skip_metadata_api_check = true
  # skip ec2/DescribeAccountAttributes to ec2.auto.amazonaws.com
  skip_get_ec2_platforms = true
  endpoints {
    # https://developers.cloudflare.com/r2/platform/s3-compatibility/api/
    s3 = "https://${var.account_id}.r2.cloudflarestorage.com"
  }
  alias = "cloudflare_r2"
}


resource "aws_s3_bucket" "terraform" {
  provider = aws.cloudflare_r2
    bucket = "terraform-backends"
}
