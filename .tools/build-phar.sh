#!/bin/bash

WORKDIR=$(pwd)
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$(dirname "$SCRIPT")")

set -e

cd "$BASEDIR/server" || exit 1

set +e
php -d phar.readonly=0 ./webman build:phar
status=$?
set -e

if [ $status -ne 0 ]; then
  echo "Build phar failed"
fi

cd "$BASEDIR" || exit 1
