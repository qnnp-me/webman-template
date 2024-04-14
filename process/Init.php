<?php

namespace process;

use Phar;
use Phinx\Console\PhinxApplication;
use Phinx\Wrapper\TextWrapper;

class Init
{
  public function __construct()
  {
    if (is_phar()) {
      $phar = Phar::running();
      if ($phar) {
        $phar = new Phar($phar);
        $extract_list = [
          'database/' => runtime_path('phinx'),
          'public/' => run_path(),
          'plugin/admin/public/' => run_path(),
        ];
        foreach ($extract_list as $from => $to) {
          $phar->extractTo($to, $from, true);
        }
      }
    }
    if (env('APP_ENV') == 'prod') {
      $app = new PhinxApplication();
      $wrap = new TextWrapper($app);
      $wrap->setOption('configuration', base_path('phinx.php'));
      $wrap->getMigrate();
      $wrap->getStatus();
    }
  }
}
