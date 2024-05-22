#!/bin/bash

set -e

current_dir=$(pwd)
cd "../server" || true

set +e
php -d phar.readonly=0 ./webman build:bin 8.2
status=$?
set -e

if [ $status -ne 0 ]; then
    echo "Build failed"
    cd "$current_dir" || true
fi
