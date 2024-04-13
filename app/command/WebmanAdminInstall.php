<?php

namespace app\command;

use GuzzleHttp\Client;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class WebmanAdminInstall extends Command
{
  protected static $defaultName = 'webman:admin:install';
  protected static $defaultDescription = 'webman admin install';
  protected Client $client;
  use trait\command;

  /**
   * @return void
   */
  protected function configure(): void
  {
  }

  /**
   * @param InputInterface $input
   * @param OutputInterface $output
   * @return int
   */
  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $this->input = $input;
    $this->output = $output;

    $server_address = config('server.listen');
    $this->client = new Client([
      'base_uri' => $server_address . '/app/admin/install/',
    ]);

    check_server_running:
    $server_running = $this->isServerRunning();
    if (!$server_running) {
      $this->alert('请先启动 webman 服务');
      goto check_server_running;
    }

    install_check:
    $installed = file_exists(base_path('plugin/admin/config/database.php'));
    if ($installed) {
      $this->notice('管理后台已经安装！请删除 plugin/admin/config/database.php 文件重新安装.');
      if ($this->confirm('删除继续?')) {
        if (!unlink(base_path('plugin/admin/config/database.php'))) {
          $this->failed('删除 plugin/admin/config/database.php 失败');
        }
        goto install_check;
      } else {
        $this->notice('取消安装');
        return self::FAILURE;
      }
    }

    $this->notice('开始安装 webman/admin 管理后台');
    $this->notice('即将执行安装第一步');
    $confirm = $this->confirm('继续?', true);
    if (!$confirm) {
      $this->notice('取消安装');
      return self::FAILURE;
    }

    if (!function_exists('env')) {
      function env($key, $default = null)
      {
        return $default;
      }
    }

    $can_use_env = !!env('MYSQL_PORT', '');

    step1:
    $default_db_host = env('MYSQL_HOST', '127.0.0.1');
    $default_db_name = env('MYSQL_DBNAME', '');

    $database_host = $this->input("请输入数据库名称", env('MYSQL_HOST', '127.0.0.1'));
    $database_port = $this->input("请输入数据库端口", env('MYSQL_PORT', '3306'));
    $database_name = $this->input("请输入数据库名称", env('MYSQL_DBNAME', ''), true);
    $database_user = $this->input("请输入数据库账户", env('MYSQL_USER', ''), true);
    $database_password = $this->input("请输入数据库密码", env('MYSQL_PASSWORD', ''));


    $use_env = false;
    if ($default_db_host == $database_host && $default_db_name == $database_name) {
      $use_env = true;
    }

    $overwrite = false;
    step1_result:
    $step1 = $this->executeStep1(
      $database_host,
      $database_port,
      $database_name,
      $database_user,
      $database_password,
      $overwrite
    );

    if ($step1->code != 0) {
      if (str_contains($step1->msg, "强制覆盖")) {
        $this->warning($step1->msg);
        if ($this->confirm("是否覆盖安装?")) {
          $overwrite = true;
          goto step1_result;
        } else {
          $this->notice("取消安装");
          return self::FAILURE;
        }
      } else {
        $this->failed($step1->msg);
        if ($this->confirm("重试?", true)) {
          goto step1;
        } else {
          $this->notice("取消安装");
          return self::FAILURE;
        }
      }
    }

    if ($can_use_env) {
      if ($use_env) {
        $this->notice("数据库连接信息和 .env 配置相同, 将使用 .env 配置.");
      } else {
        $this->notice("数据库连接信息与 webman 配置不同, 将使用 .env 文件的 ADMIN_MYSQL_* 配置.");
        save_env_file:
        $result = $this->saveEnv(
          $database_host,
          $database_port,
          $database_name,
          $database_user,
          $database_password,
        );
        if ($result) {
          $this->success(".env 文件写入成功");
        } else {
          $this->failed(".env 文件写入失败");
          if ($this->confirm('重试?', true)) {
            goto save_env_file;
          } else {
            $this->notice("取消安装");
            return self::FAILURE;
          }
        }
      }
      save_database_config:
      if ($this->writeConfigDatabasePhp($use_env ? 'MYSQL' : 'ADMIN_MYSQL')) {
        $this->success("配置文件 plugin/admin/config/database.php 写入成功");
      } else {
        $this->failed("配置文件 plugin/admin/config/database.php 写入失败");
        $this->notice("请检查 config/database.php 文件是否有权限");
        if ($this->confirm('是否重试?', true)) {
          goto save_database_config;
        } else {
          $this->notice("取消安装");
          return self::FAILURE;
        }
      }
    }

    $reload_server = posix_kill($this->getServerPid(), SIGUSR1);
    if (!$reload_server) {
      $this->warning("重载 webman 服务失败");
    } else {
      $this->success("重载 webman 服务成功");
    }

    $this->success("数据库安装完成, 开始设置管理员账号");


    step2:
    step2_username:
    $username = $this->input("请输入管理员用户名", bin2hex(random_bytes(6)));
    step2_password:
    $default_admin_password = bin2hex(random_bytes(8));
    $password = $this->input("请输入管理员的密码", $default_admin_password, hiding: true);
    $password2 = $this->input("请再输入管理员密码", $default_admin_password, hiding: true);
    if ($password != $password2) {
      $this->warning("两次密码不一致");
      if ($this->confirm("重试?", true)) {
        goto step2_password;
      } else {
        $this->notice("取消安装");
        return self::FAILURE;
      }
    }

    $step2 = $this->executeStep2($username, $password);
    if ($step2->code != 0) {
      $this->failed($step2->msg);
      if ($this->confirm("是否重试?", true)) {
        goto step2;
      } else {
        $this->notice("取消安装");
        return self::FAILURE;
      }
    }

    $this->notice("管理员账号设置完成");

    $this->info([
      '请牢记以下信息:',
      '管理员用户名: ' . $username,
      '管理员密码:   ' . $password
    ]);

    $this->success('安装完成');
    return self::SUCCESS;
  }

  protected function executeStep2(string $username, string $password)
  {
    return json_decode($this->client->post('step2', [
      'json' => [
        'username'         => $username,
        'password'         => $password,
        'password_confirm' => $password
      ]
    ])->getBody()->getContents());
  }

  protected function writeConfigDatabasePhp($group = 'ADMIN_MYSQL'): bool
  {
    $file = base_path('plugin/admin/config/database.php');
    $config = $this->generateConfigDatabasePhp($group);
    return !!file_put_contents($file, $config);
  }

  protected function generateConfigDatabasePhp($group = 'ADMIN_MYSQL'): string
  {
    return <<<PHP
<?php
return [
    'default'     => 'mysql',
    'connections' => [
        'mysql' => [
            'driver'    => 'mysql',
            'host'      => env('{$group}_HOST'),
            'port'      => env('{$group}_PORT', '3306'),
            'database'  => env('{$group}_DBNAME'),
            'username'  => env('{$group}_USER'),
            'password'  => env('{$group}_PASSWORD'),
            'charset'   => 'utf8mb4',
            'collation' => 'utf8mb4_general_ci',
            'prefix'    => '',
            'strict'    => true,
            'engine'    => null,
        ],
    ],
];
PHP;
  }

  protected function executeStep1(
    $database_host,
    $database_port,
    $database_name,
    $database_user,
    $database_password,
    $overwrite = false
  ): object
  {
    $data = [
      'user'      => $database_user,
      'password'  => $database_password,
      'database'  => $database_name,
      'host'      => $database_host,
      'port'      => $database_port,
      'overwrite' => $overwrite ? '1' : '',
    ];
    return json_decode($this->client->post('step1', ['json' => $data])->getBody()->getContents());
  }

  protected function getServerPid(): ?int
  {
    $pid_file = config('server.pid_file');
    if (file_exists($pid_file)) {
      $pid = file_get_contents($pid_file);
      if (posix_getpgid($pid)) {
        return (int)$pid;
      }
    }
    return null;
  }

  protected function isServerRunning(): bool
  {
    $pid = $this->getServerPid();
    if ($pid) {
      if (posix_getpgid($pid)) {
        return true;
      }
    }
    return false;
  }

  protected function saveEnv(
    $database_host,
    $database_port,
    $database_name,
    $database_user,
    $database_password,
  )
  {
    $file = base_path('.env');
    $content = file_get_contents($file);
    if (str_contains($content, 'ADMIN_MYSQL_HOST')) {
      $content = preg_replace('/ADMIN_MYSQL_HOST=(.*)/', "ADMIN_MYSQL_HOST={$database_host}", $content);
    } else {
      $content .= "\n";
      $content .= "ADMIN_MYSQL_HOST={$database_host}\n";
    }
    if (str_contains($content, 'ADMIN_MYSQL_PORT')) {
      $content = preg_replace('/ADMIN_MYSQL_PORT=(.*)/', "ADMIN_MYSQL_PORT={$database_port}", $content);
    } else {
      $content .= "ADMIN_MYSQL_PORT={$database_port}\n";
    }
    if (str_contains($content, 'ADMIN_MYSQL_DBNAME')) {
      $content = preg_replace('/ADMIN_MYSQL_DBNAME=(.*)/', "ADMIN_MYSQL_DBNAME={$database_name}", $content);
    } else {
      $content .= "ADMIN_MYSQL_DBNAME={$database_name}\n";
    }
    if (str_contains($content, 'ADMIN_MYSQL_USER')) {
      $content = preg_replace('/ADMIN_MYSQL_USER=(.*)/', "ADMIN_MYSQL_USER={$database_user}", $content);
    } else {
      $content .= "ADMIN_MYSQL_USER={$database_user}\n";
    }
    if (str_contains($content, 'ADMIN_MYSQL_PASSWORD')) {
      $content = preg_replace('/ADMIN_MYSQL_PASSWORD=(.*)/', "ADMIN_MYSQL_PASSWORD={$database_password}", $content);
    } else {
      $content .= "ADMIN_MYSQL_PASSWORD={$database_password}\n";
    }

    return file_put_contents($file, $content);
  }

}
