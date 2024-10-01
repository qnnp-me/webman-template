#!/bin/bash

WORKDIR=$(pwd)
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$(dirname "$SCRIPT")")

set -e

cd "$BASEDIR/web" || exit 1

set +e
pnpm build || exit 1
status=$?
set -e

if [ $status -ne 0 ]; then
  echo "Build web failed"
fi

cd "$BASEDIR" || exit 1
