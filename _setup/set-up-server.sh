#!/bin/sh -xe

sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y golang
export GOPATH=~/gopath
PATH=$PATH:$GOPATH/bin
go get -u github.com/xenolf/lego

sudo apt-get install -y certbot


sudo systemctl reload-daemon
sudo systemctl start refresh-cert-yonathan.org.service

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
