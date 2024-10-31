<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreateUserLogs extends AbstractMigration
{
  public function change(): void
  {
    $table = $this->table('user_logs');
    $table
      ->addColumn('user_id', 'integer', ['null' => false])
      ->addColumn('action', 'string', ['null' => false])
      ->addColumn('target', 'string', ['null' => false])
      ->addColumn('from', 'string', ['null' => false])
      ->addColumn('ip', 'string', ['null' => true])
      ->addColumn('user_agent', 'string', ['null' => true])
      ->addColumn('detail', 'text', ['null' => false, 'length' => MysqlAdapter::TEXT_LONG])
      ->addColumn('internal_detail', 'text', ['null' => true, 'length' => MysqlAdapter::TEXT_LONG])
      ->addTimestamps()
      ->addIndex('user_id')
      ->addIndex('ip')
      ->addIndex('created_at')
      ->save();
    if ($this->isMigratingUp()) {
      $table
        ->insert([
          [
            'user_id' => 1,
            'action'  => 'create',
            'target'  => 'user',
            'from'    => 'system',
            'detail'  => 'create by phinx migration'
          ]
        ])
        ->save();
    }
  }
}
