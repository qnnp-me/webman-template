#!/bin/bash

WORKDIR=$(pwd)
BASEDIR=$(dirname "$0")

set -e

cd "$BASEDIR/../web" || true

set +e
pnpm build
status=$?
set -e

if [ $status -ne 0 ]; then
  echo "Build web failed"
fi

cd "$WORKDIR" || true
