#!/bin/bash

WORKDIR=$(pwd)
BASEDIR=$(dirname "$0")

set -e

cd "$BASEDIR/../server" || true

set +e
php -d phar.readonly=0 ./webman build:bin 8.2
status=$?
set -e

if [ $status -ne 0 ]; then
  echo "Build failed"
fi

cd "$WORKDIR" || true
