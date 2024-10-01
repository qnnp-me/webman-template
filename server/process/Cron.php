<?php

namespace process;

use app\attr\CronRule;
use Exception;
use ReflectionClass;
use Workerman\Crontab\Crontab;

class Cron
{
  function onWorkerStart(): void
  {
    $path = base_path('app/cron');
    $files = scandir($path);
    foreach ($files as $file) {
      $class = 'app\\cron\\' . str_replace('.php', '', $file);
      if (
        str_ends_with($class, "Cron")
        && class_exists($class)
        && ($ref = new ReflectionClass($class))->hasMethod('run')
      ) {
        $method = $ref->getMethod('run');
        $attrs = $method->getAttributes(CronRule::class);
        $is_static = $method->isStatic();
        foreach ($attrs as $attr) {
          $rule = $attr->getArguments()[0] ?? false;
          if ($rule) {
            try {
              new Crontab($rule, [$is_static ? $class : $ref->newInstance(), 'run']);
            } catch (Exception $e) {
              echo "add Crontab Error: $class -> " . $e->getMessage() . PHP_EOL;
            }
          }
        }
      }
    }
  }
}
