<?php

namespace app\command;


use Exception;
use Spatie\DbDumper\Databases\MySql;
use support\helper\CommandHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DatabaseExport extends Command
{
  protected static string $defaultName = 'database:export';

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $command_helper = new CommandHelper();
    if (!is_dir(base_path('/database/sql'))) mkdir(base_path('/database/sql'), 0755, true);

    $mysql = new MySql;
    $mysql
      ->setHost(env('MYSQL_HOST'))
      ->setDbName(env('MYSQL_DBNAME'))
      ->setUserName(env('MYSQL_USER'))
      ->setPassword(env('MYSQL_PASSWORD'))
      ->setPort(env('MYSQL_PORT'));
    //////////[ Rules/Roles ]//////////
    try {
      $mysql
        ->includeTables(['wa_rules', 'wa_roles'])
        ->dumpToFile(base_path('/database/sql/rules-roles-dump.sql'));
      $command_helper->success('导出`wa_rules, wa_roles`成功');
    } catch (Exception $e) {
      $command_helper->error(explode("\n", "导出`wa_rules, wa_roles`失败: \n" . $e->getMessage()));
    }
    //////////[ End ]//////////
    return self::SUCCESS;
  }
}