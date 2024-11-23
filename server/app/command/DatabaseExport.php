<?php

namespace app\command;


use Spatie\DbDumper\Databases\MySql;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DatabaseExport extends Command
{
  protected static $defaultName = 'database:export';

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $mysql = new MySql;
    $mysql
      ->setHost(env('MYSQL_HOST'))
      ->setDbName(env('MYSQL_DBNAME'))
      ->setUserName(env('MYSQL_USER'))
      ->setPassword(env('MYSQL_PASSWORD'))
      ->setPort(env('MYSQL_PORT'));
    $mysql
      ->includeTables(['wa_rules', 'wa_roles'])
      ->dumpToFile(base_path('/database/sql/rules-roles-dump.sql'));
    $mysql
      ->includeTables([
        'wa_admins',
        'wa_admin_roles',
        'wa_options',
        'wa_roles',
        'wa_rules',
        'wa_uploads',
        'wa_users',
      ])
      ->doNotDumpData()
      ->dumpToFile(base_path('/database/sql/structure-dump.sql'));
    return self::SUCCESS;
  }
}