#!/bin/bash

WORKDIR=$(pwd)

read -r -p "Enter project name: " project_name
if [ -z "$project_name" ]; then
  project_name="webman"
fi

if [ -d "$project_name" ]; then
  echo "$project_name already exists"
  exit
fi

# clone template
git_exists=$(which git)

if [ -z "$git_exists" ]; then
  echo "git not found"
  exit
fi

git clone https://github.com/qnnp-me/webman-template.git "$project_name"
rm -rf "$project_name/.git"
rm -rf "$project_name/README.md"
rm -rf "$project_name/web/README.md"
rm -rf "$project_name/server/README.md"

# install dependencies

composer_exists=$(which composer)

if [ -z "$composer_exists" ]; then
  echo "composer not found"
  exit
fi
cd "$WORKDIR/$project_name/server" || exit
composer install

cd "$WORKDIR/$project_name/web" || exit

pnpm_exists=$(which pnpm)

if [ -z "$pnpm_exists" ]; then
  echo "pnpm not found"
  exit
fi
pnpm i

cd "$WORKDIR" || exit

rm -rf "$project_name/.tools/create-project.sh"
