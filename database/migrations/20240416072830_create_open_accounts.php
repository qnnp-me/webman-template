<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateOpenAccounts extends AbstractMigration
{
  public function change(): void
  {
    $table = $this->table('open_accounts', ['comment' => '第三方平台账号']);
    $table
      ->addColumn('admin_id', 'string', ['comment' => '管理员ID'])
      ->addColumn('app_id', 'string', ['comment' => '应用ID'])
      ->addColumn('type', 'string', ['comment' => '类型'])
      ->addColumn('description', 'string', ['comment' => '描述'])
      ->addColumn('enabled', 'boolean', ['comment' => '是否启用', 'default' => true])
      ->addTimestamps()
      ->addIndex(['admin_id'])
      ->addIndex(['app_id'])
      ->create();
  }
}
