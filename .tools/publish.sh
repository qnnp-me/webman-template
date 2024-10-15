#!/bin/bash

WORKDIR=$(pwd)
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$(dirname "$SCRIPT")")

cd "$BASEDIR" || exit 1

. ".tools/build-all.sh" || exit 1
. ".tools/publish-only.sh" || exit 1