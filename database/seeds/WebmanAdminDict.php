<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;
use plugin\admin\app\model\Option as OptionModel;
use support\Db;

class WebmanAdminDict extends AbstractSeed
{
  /**
   * Run Method.
   *
   * Write your database seeder using this method.
   *
   * More information on writing seeders is available here:
   * https://book.cakephp.org/phinx/0/en/seeding.html
   */
  public function run(): void
  {
    if (function_exists('config') && config('database.default')) {
      // 第三方平台字典
      if (Db::schema()->hasTable('wa_options') && !OptionModel::where('name', 'dict_open_account_types')->first()) {
        OptionModel::unguarded(function () {
          $value = [
            ["value" => "wechat_official", "name" => "微信公众号"],
            ["value" => "wechat_mini", "name" => "微信小程序"],
            ["value" => "wechat_open", "name" => "微信开放平台"],
            ["value" => "wechat_pay", "name" => "微信支付"],
            ["value" => "wechat_work", "name" => "企业微信"],
            ["value" => "wechat_open_work", "name" => "企业微信开放平台"],
          ];
          OptionModel::create([
            'name'  => 'dict_open_account_types',
            'value' => json_encode($value,JSON_UNESCAPED_UNICODE),
          ]);
        });
      }
    }
  }
}
