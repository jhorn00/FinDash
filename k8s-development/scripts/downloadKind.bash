#!/bin/bash

curl -s https://api.github.com/repos/kubernetes-sigs/kind/releases/latest| grep browser_download_url | grep kind-linux-amd64 | cut -d '"' -f 4  | wget -qi -
chmod a+x kind-linux-amd64
mv kind-linux-amd64 /usr/local/bin/kind
