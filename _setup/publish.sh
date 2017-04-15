#!/bin/sh -xe

~/.cargo/bin/cobalt build && gsutil -m -h "Cache-Control:public, max-age=60" rsync -c -r -d build/ gs://yonathan/
rsync -e 'ssh -i ~/.ssh/kube_aws_rsa' --rsync-path='sudo rsync' _setup/nginx-yonathan.org.conf yonathan@yonathan.org:/etc/nginx/sites-available/nginx-yonathan.org.conf && ssh -i ~/.ssh/kube_aws_rsa yonathan@yonathan.org 'systemctl reload nginx'