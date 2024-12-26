<?php

declare(strict_types=1);

use app\process\Init;
use Phinx\Migration\AbstractMigration;
use support\helper\CommandHelper;

final class CreateUsers extends AbstractMigration
{
  public function change(): void
  {
    $command_helper = new CommandHelper();
    $table = $this->table('users');
    $table
      ->addColumn('password', 'string', ['null' => true])
      ->addColumn('status', 'enum', ['values' => ['normal', 'blocked', 'banned', 'pending']])
      ->addTimestamps()
      ->save();
    if ($this->isMigratingUp()) {
      $table
        ->insert([
          [
            'password' => password_hash('admin', PASSWORD_DEFAULT),
            'status'   => 'normal',
          ],
        ])
        ->save();
      $command_helper->notice('Create admin user password: admin');
      Init::$results += ['username: admin', 'password: admin'];
    }
  }
}
