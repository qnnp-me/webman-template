<?php

namespace support\init;

use Phar;

class ReleaseFiles implements InitInterface
{

  static function run(): void
  {
    if (is_phar()) {
      $phar = Phar::running();
      if ($phar && config('extract.enable')) {
        $phar = new Phar($phar);
        $extract_list = config('extract.list');
        foreach ($extract_list as $from => $to) {
          $phar->extractTo($to, $from, true);
        }
      }
    }
  }
}
