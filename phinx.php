<?php

use Dotenv\Dotenv;

if (class_exists('Dotenv\Dotenv') && file_exists(base_path(false) . '/.env')) {
  if (method_exists('Dotenv\Dotenv', 'createUnsafeMutable')) {
    Dotenv::createUnsafeMutable(base_path(false))->load();
  } else {
    Dotenv::createMutable(base_path(false))->load();
  }
}

var_dump(__FILE__ . ':' . __LINE__ . ':' . __FUNCTION__, base_path("database/migrations"));

return [
  "paths"        => [
    "migrations" => is_phar() ? runtime_path('phinx/database/migrations') : base_path("database/migrations"),
    "seeds"      => is_phar() ? runtime_path('phinx/database/seeds') : base_path("database/seeds")
  ],
  "environments" => [
    "default_migration_table" => "phinxlog",
    "default_environment"     => "default",
    "default"                 => [
      "adapter"   => "mysql",
      "host"      => env("MYSQL_HOST"),
      "name"      => env("MYSQL_DBNAME"),
      "user"      => env("MYSQL_USER"),
      "pass"      => env("MYSQL_PASSWORD"),
      "port"      => env("MYSQL_PORT", "3306"),
      "charset"   => "utf8mb4",
      'collation' => 'utf8mb4_general_ci',
    ],
  ]
];
