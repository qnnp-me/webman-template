<?php

namespace app\bootstrap;

use Webman\Bootstrap;
use Workerman\Worker;

class ModelEvents implements Bootstrap
{

  /**
   * @inheritDoc
   */
  public static function start(?Worker $worker): void
  {
    // /plugin/admin 注册 deleted 事件监听器
//    PluginAdminUserModel::deleted(function (PluginAdminUserModel $user) {
//      $id = $user->id;
//      OpenUserModel::where('user_id', $id)->each(function (OpenUserModel $item) {
//        $item->delete();
//      });
//    });
  }
}
