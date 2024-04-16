<?php

namespace app\module;

use app\model\OpenAccountModel;
use app\type\OpenConfigType;
use EasyWeChat\{Kernel\Exceptions\InvalidArgumentException,
  MiniApp\Application as WechatMini,
  OfficialAccount\Application as WechatOfficial,
  OpenPlatform\Application as OpenPlatform};
use support\exception\BusinessException;
use support\Log;

class OpenModule
{
  private static array $apps = [];

  static function getApp($app_id, $admin_id = 1)
  {
    if (
      !isset(static::$apps[$app_id])
      || (isset(static::$apps[$app_id]) && static::$apps[$app_id]['timestamp'] > time() - 3600)
    ) {
      /* @var $account OpenAccountModel */
      $account = OpenAccountModel::where(['app_id' => $app_id, 'admin_id' => $admin_id])->first();
      if (!$account) {
        Log::error("第三方平台 {$app_id} 未配置", ['admin_id' => $admin_id]);
        throw new BusinessException("第三方平台 {$app_id} 未配置");
      }
      $config = $account->settings->pluck('value', 'field')->toArray();
      static::$apps[$app_id]['config'] = (object)$config;
      static::$apps[$app_id]['timestamp'] = time();
    }
    /** @var  $config OpenConfigType */
    $config = static::$apps[$app_id]['config'];
    $http_config = [
      'throw' => false
    ];
    $app = null;
    try {
      switch ($account->type) {
        case OpenTypeEnum::WechatOfficial:
          $app = new WechatOfficial([
            'app_id'  => $config->app_id,
            'secret'  => $config->secret,
            'token'   => $config->token,
            'aes_key' => $config->aes_key,
            'http'    => $http_config,
          ]);
          break;
        case OpenTypeEnum::WechatMini:
          $app = new WechatMini([
            'app_id' => $config->app_id,
            'secret' => $config->secret,
          ]);
          break;
        case OpenTypeEnum::WechatOpen:
          $app = new OpenPlatform([
            'app_id'  => $config->app_id,
            'secret'  => $config->secret,
            'token'   => $config->token,
            'aes_key' => $config->aes_key,
            'http'    => $http_config,
          ]);
          break;
      }
    } catch (InvalidArgumentException $e) {
      Log::error($e->getMessage(), ['account' => $account->toArray(), 'admin_id' => $admin_id]);
      throw new BusinessException($e->getMessage());
    }
    return $app;
  }
}
