<?php

namespace app\process;

use ReflectionClass;
use support\helper\CommandHelper;
use Throwable;

class Init
{
  /**
   * @var string[]
   */
  static array $results = [];

  public function __construct()
  {
    $command_helper = new CommandHelper();
    $base_path = base_path('app/init');
    $all_files = scan_all_files($base_path);
    $init_functions = [];
    $command_helper->notice('Processing Init Files');
    foreach ($all_files as $file) {
      $relative_path = str_replace(base_path(), '', $file);
      $class = str_replace(base_path(), '', str_replace(".php", '', $file));
      $class = str_replace('/', '\\', $class);
      if (class_exists($class) && method_exists($class, 'run')) {
        $class_ref = new ReflectionClass($class);
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
            'file'   => $relative_path,
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
        $command_helper->info("Executing Init File: {$function['file']}");
        call_user_func($function['call']);
      } catch (Throwable $th) {
        $command_helper->error("Executing Init File Error: {$th->getMessage()}\n{$th->getTraceAsString()}");
      }
    }
    if (self::$results) {
      $command_helper->notice(self::$results);
    }
    $command_helper->info('Init Finished');
  }
}
