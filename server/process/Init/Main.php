<?php

namespace process\Init;

class Main
{
  public function __construct()
  {
    $base_path = base_path('process/Init');
    $all_files = getAllFiles($base_path);
    foreach ($all_files as $file) {
      $class = str_replace(base_path(), '', str_replace(".php", '', $file));
      if (str_starts_with($class, '/process/Init/Init')) {
        $class = str_replace('/', '\\', $class);
        if (class_exists($class) && method_exists($class, 'run')) {
          $class::run();
        }
      }
    }
  }
}
