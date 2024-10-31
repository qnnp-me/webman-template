<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;
use support\helper\CommandHelper;

final class CreateUserIdentifiers extends AbstractMigration
{
  public function change(): void
  {
    $command_helper = new CommandHelper();
    $table = $this->table('user_identifiers');
    $table
      ->addColumn('user_id', 'integer', ['null' => false])
      ->addColumn('type', 'string', ['null' => false])
      ->addColumn('identifier', 'string', ['null' => false])
      ->addTimestamps()
      ->addIndex('identifier', ['unique' => true])
      ->addIndex(['user_id', 'type'], ['unique' => true])
      ->save();
    if ($this->isMigratingUp()) {
      $table
        ->insert([
          [
            'user_id'    => 1,
            'type'       => 'username',
            'identifier' => 'admin',
          ],
        ])
        ->save();
      $command_helper->notice('Create admin user name: admin');
    }
  }
}
