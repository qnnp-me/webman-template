#!/bin/bash

WORKDIR=$(pwd)
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$(dirname "$SCRIPT")")

cd "$BASEDIR/server/build" || exit 1

rsync -avz server.bin "{$PUBLISH_USER}@{$PUBLISH_HOST}:{$PUBLISH_PATH}" || exit 1
ssh "{$PUBLISH_USER}@{$PUBLISH_HOST}" "if [ ! -f /etc/ssl/certs/ca-certificates.crt ]; then curl https://curl.se/ca/cacert.pem --output /etc/ssl/certs/ca-certificates.crt; fi;"
ssh "{$PUBLISH_USER}@{$PUBLISH_HOST}" "{PUBLISH_SHELL}"
