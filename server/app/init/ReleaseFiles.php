<?php

namespace app\init;

use Phar;
use support\abstract\InitAbstract;
use support\helper\CommandHelper;

class ReleaseFiles extends InitAbstract
{
  public int $weight = 0;

  function run(): void
  {
    if (is_phar()) {
      $command_helper = new CommandHelper();
      $phar = Phar::running();
      if ($phar && config('extract.enable')) {
        $command_helper->notice("Releasing files...");
        $phar = new Phar($phar);
        $extract_list = config('extract.list');
        foreach ($extract_list as $from => $to) {
          $phar->extractTo($to, $from, true);
          $command_helper->info("Release $from to $to");
        }
        $command_helper->success("Release success.");
      }
    }
  }
}
