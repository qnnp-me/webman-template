<?php

namespace process\Init;

use Phar;
use process\Init\InitInterface;

class InitReleaseFiles implements InitInterface
{

  static function run(): void
  {
    if (is_phar()) {
      $phar = Phar::running();
      if ($phar) {
        $phar = new Phar($phar);
        $extract_list = [
          'database/'            => runtime_path('phinx'),
          'public/'              => run_path(),
          'plugin/admin/public/' => run_path(),
        ];
        foreach ($extract_list as $from => $to) {
          $phar->extractTo($to, $from, true);
        }
      }
    }
  }
}
