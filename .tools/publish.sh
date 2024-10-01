#!/bin/bash

WORKDIR=$(pwd)
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$(dirname "$SCRIPT")")

cd "$BASEDIR" || exit 1

. ".tools/build-web.sh" || exit 1
. ".tools/build-bin.sh" || exit 1
if [ -f ".tools/.env" ]; then
  . ".tools/.env" || exit 1
fi

cd "$BASEDIR/server/build" || exit 1

rsync -avz server.bin "{$PUBLISH_USER}@{$PUBLISH_HOST}:{$PUBLISH_PATH}" || exit 1
ssh "{$PUBLISH_USER}@{$PUBLISH_HOST}" "{PUBLISH_SHELL}"
