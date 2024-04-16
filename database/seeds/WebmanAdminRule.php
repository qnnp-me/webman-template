<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;
use plugin\admin\app\model\Rule as RuleModel;
use support\Db;

class WebmanAdminRule extends AbstractSeed
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
      if (Db::schema()->hasTable('wa_rules') && !RuleModel::where('key', 'app\admin\controller\OpenAccountController')->first()) {
        RuleModel::unguarded(function () {
          /* @var RuleModel $common_menu */
          $common_menu = RuleModel::where('key', 'common')->first();
          if ($common_menu) {
            $data = [
              'title' => '第三方平台管理',
              'icon'  => 'layui-icon-template-1',
              'key'   => 'app\admin\controller\OpenAccountController',
              'href'  => '/admin/open-account/index',
              'type'  => 1,
            ];
            $data['pid'] = $common_menu->id;
            RuleModel::create($data);
          }
        });
      }
    }
  }
}
