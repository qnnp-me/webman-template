<?php

declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class Database extends AbstractSeed
{
  public function run(): void
  {
    if (env('APP_ENV') == 'prod') {
      $log_dir = runtime_path('phinx');
      if (!file_exists($log_dir)) {
        mkdir($log_dir, 0777, true);
      }
      $log_path = runtime_path('phinx/seeds.json');
      $log = [];
      if (file_exists($log_path)) {
        $log = json_decode(file_get_contents($log_path), true) ?: [];
      }
      $structure_path = is_phar()
        ? runtime_path('/phinx/database/sql/structure-dump.sql')
        : base_path('/database/sql/structure-dump.sql');
      if (file_exists($structure_path) && !$this->table('wa_admins')->exists()) {
        $this->query(file_get_contents($structure_path));
      }
      $rules_roles_path = is_phar()
        ? runtime_path('/phinx/database/sql/rules-roles-dump.sql')
        : base_path('/database/sql/rules-roles-dump.sql');
      if (file_exists($rules_roles_path) && $log['rules_roles'] ?? 0 != ($last_mtime = filemtime($rules_roles_path))) {
        $this->query(file_get_contents($rules_roles_path));
        $log['rules_roles'] = $last_mtime;
      }
      file_put_contents($log_path, json_encode($log, JSON_PRETTY_PRINT));
    }
  }
}
