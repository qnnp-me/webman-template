<?php

declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTest extends AbstractMigration
{
  /**
   * Change Method.
   *
   * Write your reversible migrations using this method.
   *
   * More information on writing migrations is available here:
   * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
   *
   * Remember to call "create()" or "update()" and NOT "save()" when working
   * with the Table class.
   */
  public function change(): void
  {
    $table = $this->table('test', ['comment' => '测试表']);
    $table
      ->addColumn('name', 'string', ['comment' => '名称'])
      ->addColumn('age', 'integer', ['comment' => '年龄'])
      ->create();
  }
}
