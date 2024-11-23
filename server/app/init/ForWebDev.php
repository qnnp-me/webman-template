<?php

namespace app\init;

use plugin\admin\app\common\Util;
use plugin\admin\app\model\Rule;
use ReflectionClass;
use ReflectionException;
use support\abstract\InitAbstract;

class ForWebDev extends InitAbstract
{
  protected static string $base_path;
  protected static string $web_folder = 'web';

  static function init_generate_types(): void
  {
    $keys = Rule::select(['key'])->pluck('key');
    $date = date('Y-m-d H:i:s');
    $permissions = <<<TS
// 此文件由脚本生成，请勿手动修改 {$date}
declare type AdminPermission =
  '*'

TS;
    foreach ($keys as $key) {
      if (!$key = Util::controllerToUrlPath($key)) {
        continue;
      }
      $code = str_replace('/', '.', trim($key, '/'));
      $permissions .= "  | '$code'\n";
    }
    file_put_contents(self::$base_path . DIRECTORY_SEPARATOR . 'src/types/AdminPermission.d.ts', $permissions);
  }

  function run(): void
  {
    self::$base_path = dirname(run_path()) . DIRECTORY_SEPARATOR . self::$web_folder;
    if (file_exists(self::$base_path)) {
      $ref = new ReflectionClass(self::class);
      $methods = $ref->getMethods();
      foreach ($methods as $method) {
        if (!$method->isStatic()) {
          continue;
        }
        if (str_starts_with($method->name, 'init_')) {
          try {
            $method->invoke(null);
          } catch (ReflectionException $e) {
            echo $e->getMessage();
          }
        }
      }
    }
  }
}