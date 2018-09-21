#!/bin/sh -xe
SCRIPT_DIR=$(cd $(dirname $0); pwd)

# prereq: install cobalt-bin
cd $SCRIPT_DIR/.. && cobalt build && 
cd $SCRIPT_DIR && npm run build-images &&
cd $SCRIPT_DIR/.. &&
gsutil -m -h "Cache-Control:public, max-age=60" rsync -c -r -d _site/ gs://yonathan/
rsync -e 'ssh -i ~/.ssh/kube_aws_rsa' --rsync-path='sudo rsync' _setup/nginx-yonathan.org.conf yonathan@yonathan.org:/etc/nginx/sites-available/nginx-yonathan.org.conf && ssh -i ~/.ssh/kube_aws_rsa yonathan@yonathan.org 'sudo systemctl reload nginx'

rsync -e 'ssh -i ~/.ssh/kube_aws_rsa' --rsync-path='sudo rsync' $SCRIPT_DIR/refresh-cert-yonathan.org.sh yonathan@yonathan.org:/usr/local/bin &&
rsync -e 'ssh -i ~/.ssh/kube_aws_rsa' --rsync-path='sudo rsync' $SCRIPT_DIR/refresh-cert-yonathan.org.{service,timer} yonathan@yonathan.org:/etc/systemd/system/ &&
ssh -i ~/.ssh/kube_aws_rsa yonathan@yonathan.org 'sudo systemctl start refresh-cert-yonathan.org.timer && sudo systemctl enable refresh-cert-yonathan.org.timer'

ssh -i ~/.ssh/kube_aws_rsa yonathan@yonathan.org 'if ! [ -e /etc/nginx/sites-enabled/nginx-yonathan.org.conf ]; then sudo ln -s /etc/nginx/sites-available/nginx-yonathan.org.conf /etc/nginx/sites-enabled/nginx-yonathan.org.conf && sudo systemctl reload nginx; fi'
