<?php

namespace app\model;

use support\Model;

/**
 * 微信配置
 * @property string $app_id 应用ID
 * @property string $key 配置标识
 * @property string $value 配置值
 */
class OpenSettingModel extends Model
{
  protected $table = 'open_settings';
  protected $guarded = [];
  public $timestamps = false;
}
