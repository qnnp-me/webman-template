<?php

namespace app\process;

use Exception;
use ReflectionClass;
use support\attribute\CronRule;
use support\helper\CommandHelper;
use Workerman\Crontab\Crontab;

class Cron
{
  function onWorkerStart(): void
  {
    $command_helper = new CommandHelper();
    $path = base_path('app/cron');
    $files = scandir($path);
    $command_helper->notice('Loading Crontab...');
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
              $rule_str = str_pad($rule, 20, ' ', STR_PAD_BOTH);
              $command_helper->info("Crontab: [$rule_str] <- $class");
            } catch (Exception $e) {
              $command_helper->error("add Crontab Error: $class -> " . $e->getMessage());
            }
          }
        }
      }
    }
    $command_helper->info('Crontab loaded.');
  }
}
