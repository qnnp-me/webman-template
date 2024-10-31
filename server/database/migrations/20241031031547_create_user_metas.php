<?php

declare(strict_types=1);

use Phinx\Db\Adapter\MysqlAdapter;
use Phinx\Migration\AbstractMigration;

final class CreateUserMetas extends AbstractMigration
{
  public function change(): void
  {
    $this
      ->table('user_metas')
      ->addColumn('user_id', 'integer', ['null' => false])
      ->addColumn('name', 'string', ['null' => false])
      ->addColumn('value', 'text', ['null' => true, 'length' => MysqlAdapter::TEXT_LONG])
      ->addTimestamps()
      ->addIndex(['user_id', 'name'], ['unique' => true])
      ->save();
  }
}
