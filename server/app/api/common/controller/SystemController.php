<?php

namespace app\api\common\controller;

use app\common\ControllerBasic;
use plugin\admin\app\model\Option;
use support\Response;

class SystemController extends ControllerBasic
{

  /**
   * 获取 webman admin 系统配置
   */
  protected function getByDefault(): mixed
  {
    $name = 'system_config';
    $config = Option::where('name', $name)->value('value');
    if (empty($config)) {
      $config = file_get_contents(base_path('plugin/admin/public/config/pear.config.json'));
      if ($config) {
        $option = new Option();
        $option->name = $name;
        $option->value = $config;
        $option->save();
      }
    }
    return json_decode($config, true);
  }

  function info(): Response
  {
    $system_info = $this->getByDefault();
    $title = $system_info['logo']['title'];
    $logo = $system_info['logo']['image'];
    $icp = $system_info['logo']['icp'];
    $beian = $system_info['logo']['beian'];
    $footer_txt = $system_info['logo']['footer_txt'];

    if (str_starts_with($logo,'/upload/logo/') && !file_exists(public_path($logo))){
      $logo = '/app/admin/admin/images/logo.png';
    }

    return json_success([
      'title' => $title,
      'logo' => $logo,
      'icp' => $icp,
      'beian' => $beian,
      'footer_txt' => $footer_txt,
    ]);
  }
}