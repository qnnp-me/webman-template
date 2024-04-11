<?php

use Dotenv\Dotenv;

include __DIR__ . '/vendor/autoload.php';

if (class_exists('Dotenv\Dotenv') && file_exists(base_path(false) . '/.env')) {
  if (method_exists('Dotenv\Dotenv', 'createUnsafeMutable')) {
    Dotenv::createUnsafeMutable(base_path(false))->load();
  } else {
    Dotenv::createMutable(base_path(false))->load();
  }
}
return [
  "paths"        => [
    "migrations" => "database/migrations",
    "seeds"      => "database/seeds"
  ],
  "environments" => [
    "default_migration_table" => "phinxlog",
    "default_database"        => "dev",
    "default_environment"     => "dev",
    "dev"                     => [
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
