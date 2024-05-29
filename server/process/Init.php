<?php

namespace process;

class Init
{
  public function __construct()
  {
    $base_path = base_path('support/init');
    $all_files = getAllFiles($base_path);
    foreach ($all_files as $file) {
      $class = str_replace(base_path(), '', str_replace(".php", '', $file));
      $class = str_replace('/', '\\', $class);
      if (class_exists($class) && method_exists($class, 'run')) {
        $class::run();
      }
    }
  }
}
