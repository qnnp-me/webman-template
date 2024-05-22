<?php

namespace support\init;

use Phinx\Console\PhinxApplication;
use Phinx\Wrapper\TextWrapper;

class InitPhinx implements InitInterface
{

  static function run(): void
  {
    $app = new PhinxApplication();
    $wrap = new TextWrapper($app);
    $wrap->setOption('configuration', base_path('phinx.php'));
    $wrap->getMigrate();
    echo $wrap->getStatus();
    $wrap->getSeed(seed: []);
  }
}
