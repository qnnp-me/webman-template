<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreateOpenUsers extends AbstractMigration
{
  public function change(): void
  {
    $table = $this->table(
      'open_users',
      [
        'comment' => '第三方平台用户',
      ]);
    $table
      ->addColumn(
        'user_id', MysqlAdapter::PHINX_TYPE_BIG_INTEGER,
        ['limit' => MysqlAdapter::INT_BIG, 'comment' => '绑定用户ID'])
      ->addColumn(
        'account_id', MysqlAdapter::PHINX_TYPE_BIG_INTEGER,
        ['limit' => MysqlAdapter::INT_BIG, 'null' => false, 'comment' => '第三方平台账号ID'])
      ->addColumn('openid', 'string', ['limit' => 64, 'null' => false, 'comment' => 'openid'])
      ->addColumn('unionid', 'string', ['limit' => 64, 'comment' => 'unionid'])
      ->addColumn('nickname', 'string', ['limit' => 32, 'comment' => '昵称'])
      ->addColumn('headimgurl', MysqlAdapter::PHINX_TYPE_STRING, ['limit' => 512, 'comment' => '头像'])
      ->addIndex(['account_id', 'openid'])
      ->addIndex(['openid'], ['unique' => true])
      ->addIndex(['user_id'])
      ->addIndex(['unionid'])
      ->addTimestamps()
      ->create();
  }
}
