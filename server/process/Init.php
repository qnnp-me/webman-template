<?php

namespace process;

use Throwable;

class Init
{
  public function __construct()
  {
    $base_path = base_path('app/init');
    $all_files = getAllFiles($base_path);
    $init_functions = [];
    echo str_pad(' Processing Init Files ', 60, '=', STR_PAD_BOTH) . PHP_EOL;
    foreach ($all_files as $file) {
      $relative_path = str_replace(base_path(), '', $file);
      $class = str_replace(base_path(), '', str_replace(".php", '', $file));
      $class = str_replace('/', '\\', $class);
      if (class_exists($class) && method_exists($class, 'run')) {
        $class_ref = new \ReflectionClass($class);
        if ($class_ref->hasMethod('run')) {
          try {
            $weight = $class_ref->hasProperty('weight') && ($weight_ref = $class_ref->getProperty('weight'))->isPublic()
              ? (int)($weight_ref->isStatic() ? $class_ref->newInstance()::$weight : $class_ref->newInstance()->weight)
              : 10;
          } catch (Throwable $e) {
            $weight = 10;
          }
          $method = $class_ref->getMethod('run');
          $function = [
            'weight' => $weight,
            'file' => $relative_path,
          ];
          if ($method->isStatic()) {
            $function['call'] = [$class, 'run'];
          } else {
            $function['call'] = [new $class, 'run'];
          }
          $init_functions[] = $function;
        }
      }
    }
    usort($init_functions, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });
    foreach ($init_functions as $function) {
      try {
        echo str_pad(" Init File: {$function['file']} -> {$function['call'][1]} ", 60, '-', STR_PAD_BOTH) . PHP_EOL;
        call_user_func($function['call']);
      } catch (\Throwable $th) {
        echo "Init File Error: {$th->getMessage()}\n{$th->getTraceAsString()}\n";
      }
    }
    echo str_pad(' Init Finished ', 60, '=', STR_PAD_BOTH) . PHP_EOL;
  }
}
