#!/bin/sh -xe

sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y golang
export GOPATH=~/gopath
PATH=$PATH:$GOPATH/bin
go get -u github.com/xenolf/lego

sudo apt-get install -y certbot



# when testing, use --server=https://acme-v01.staging.letsencrypt.org/directory to avoid rate-limiting

export GCE_PROJECT=$(curl --silent -H 'Metadata-Flavor: Google' 169.254.169.254/computeMetadata/v1/project/project-id)
export GCE_DOMAIN=blog.yonathan.org
# prod is rate-limited to 5 failures per hour https://letsencrypt.org/docs/rate-limits/ and 5 successes per week
ACME_SERVER=https://acme-v01.api.letsencrypt.org/directory # prod
#ACME_SERVER=https://acme-staging.api.letsencrypt.org/directory # staging
# The first domain will be Subject CN and will be the name of the files
lego \
    --email=yonathan@gmail.com \
    --domains=yonathan.org --domains=blog.yonathan.org --domains=www.yonathan.org \
    --dns=gcloud \
    --server=$ACME_SERVER \
    --exclude=http-01 --exclude=tls-sni-01 \
    --dns-resolvers=ns-cloud-b1.googledomains.com \
    run


sudo mkdir -p /etc/nginx/tls
sudo cp ~/.lego/certificates/yonathan.org.key /etc/nginx/tls/
cat ~/.lego/certificates/yonathan.org.crt ~/.lego/certificates/yonathan.org.issuer.crt | sudo tee /etc/nginx/tls/yonathan.org.crtchain >/dev/null

sudo rm /etc/nginx/sites-enabled/default
sudo vim /etc/nginx/sites-available/nginx-yonathan.org.conf
# copy over nginx-yonathan.org.conf
sudo ln -s /etc/nginx/sites-available/nginx-yonathan.org.conf /etc/nginx/sites-enabled/nginx-yonathan.org.conf 

sudo mkdir -p /var/www/cache
sudo chown www-data /var/www/cache

sudo systemctl reload nginx.service
# if there are any errors, see less /var/log/nginx/error.log
