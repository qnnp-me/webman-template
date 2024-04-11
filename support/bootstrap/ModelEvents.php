<?php

namespace support\bootstrap;

use app\api\open\model\OpenUserModel;
use app\console\model\AdSetting as AppConsoleAdSettingModel;
use plugin\admin\app\model\User as PluginAdminUserModel;
use support\Cache;
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
    PluginAdminUserModel::deleted(function (PluginAdminUserModel $user) {
      $id = $user->id;
      OpenUserModel::where('user_id', $id)->each(function (OpenUserModel $item) {
        $item->delete();
      });
    });
    // /app/console
    AppConsoleAdSettingModel::updated(function (AppConsoleAdSettingModel $setting) {
      Cache::delete('app.api.ad.setting.all');
    });
  }
}
