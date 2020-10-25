#!/bin/sh -e

export GOPATH=/home/yonathan/gopath
PATH=$PATH:$GOPATH/bin

# prod is rate-limited to 5 failures per hour https://letsencrypt.org/docs/rate-limits/ and 5 successes per week
#ACME_SERVER=https://acme-v01.api.letsencrypt.org/directory # prod
ACME_SERVER=https://acme-staging.api.letsencrypt.org/directory # staging
# The first domain will be Subject CN and will be the name of the files
lego \
    --email=yonathan@gmail.com \
    --domains=yonathan.org --domains=blog.yonathan.org --domains=www.yonathan.org \
    --dns=gcloud \
    --http.webroot=/var/www/html \
    --server=$ACME_SERVER \
    --exclude=tls-sni-01 \
    --path /tmp/lego \
    renew \
    --days=30

gsutil rsync -c -r -d /etc/lego/ gs://yonathan-config/lego/

mkdir -p /etc/nginx/tls
cp /etc/lego/certificates/yonathan.org.key /etc/nginx/tls/
cat /etc/lego/certificates/yonathan.org.crt /etc/lego/certificates/yonathan.org.issuer.crt | tee /etc/nginx/tls/yonathan.org.crtchain >/dev/null

systemctl reload nginx.service