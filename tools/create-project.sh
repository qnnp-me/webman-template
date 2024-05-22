#!/bin/bash

project_name="${1:-webman}"

if [ -d "$project_name" ]; then
echo "$project_name already exists"
exit
fi

git_exists=$(which git)

if [ -z "$git_exists" ]; then
echo "git not found"
exit
fi

git clone https://github.com/qnnp-me/webman-template.git "$project_name"
rm -rf "$project_name/.git"
