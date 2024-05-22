#!/usr/bin/env php
<?php
$current_path = `pwd`;
$project_name = $argv[1] ?? 'webman';
if (file_exists($project_name)) {
  echo "$project_name already exists";
  exit;
}
$git_exists = shell_exec("which git");
if (!$git_exists) {
  echo "git not found";
  exit;
}
shell_exec("git clone https://github.com/qnnp-me/webman-template.git $project_name");
`rm -rf $project_name/.git`;