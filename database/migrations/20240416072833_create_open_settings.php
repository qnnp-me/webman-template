<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreateOpenSettings extends AbstractMigration
{
  public function change(): void
  {
    $table = $this->table(
      'open_settings',
      [
        'comment' => '第三方平台配置',
      ]);
    $table
      ->addColumn('account_id', MysqlAdapter::PHINX_TYPE_STRING, [
        'comment' => '第三方平台账号ID'
      ])
      ->addColumn('field', MysqlAdapter::PHINX_TYPE_STRING, [
        'limit'   => 64,
        'null'    => false,
        'comment' => '配置标识'
      ])
      ->addColumn('value', MysqlAdapter::PHINX_TYPE_STRING, [
        'comment' => '配置值'
      ])
      ->addIndex('account_id')
      ->addIndex('field')
      ->create();
  }
}
