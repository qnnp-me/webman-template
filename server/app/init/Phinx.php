<?php

namespace app\init;

use Phinx\Console\PhinxApplication;
use Phinx\Wrapper\TextWrapper;

class Phinx
{

  function run(): void
  {
    if (env('APP_ENV') == 'dev') return;

    $app = new PhinxApplication();
    $wrap = new TextWrapper($app);
    $wrap->setOption('configuration', base_path('phinx.php'));
    $wrap->getMigrate();
    $wrap->getSeed(seed: []);
    echo $wrap->getStatus();
  }
}
