<?php

namespace app\command;

use GuzzleHttp\Client;
use support\helper\CommandHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class WebmanAdminInstall extends Command
{
  protected static $defaultName = 'webman:admin:install';
  protected static $defaultDescription = 'webman admin install';
  protected Client $client;
  protected ?CommandHelper $helper = null;

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
    $this->helper = new CommandHelper();
    $server_address = config('server.listen');
    $this->client = new Client([
      'base_uri' => $server_address . '/app/admin/install/',
    ]);

    check_server_running:
    $server_running = $this->isServerRunning();
    if (!$server_running) {
      $this->helper->alert('请先启动 webman 服务');
      goto check_server_running;
    }

    install_check:
    $installed = file_exists(base_path('plugin/admin/config/database.php'));
    if ($installed) {
      $this->helper->notice('管理后台已经安装！请删除 plugin/admin/config/database.php 文件重新安装.');
      if ($this->helper->confirm('删除继续?')) {
        if (!unlink(base_path('plugin/admin/config/database.php'))) {
          $this->helper->failed('删除 plugin/admin/config/database.php 失败');
        }
        goto install_check;
      } else {
        $this->helper->notice('取消安装');
        return self::FAILURE;
      }
    }

    $this->helper->notice('开始安装 webman/admin 管理后台');
    $this->helper->notice('即将执行安装第一步');
    $confirm = $this->helper->confirm('继续?', true);
    if (!$confirm) {
      $this->helper->notice('取消安装');
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

    $database_host = $this->helper->input("请输入数据库名称", env('MYSQL_HOST', '127.0.0.1'));
    $database_port = $this->helper->input("请输入数据库端口", env('MYSQL_PORT', '3306'));
    $database_name = $this->helper->input("请输入数据库名称", env('MYSQL_DBNAME', ''), true);
    $database_user = $this->helper->input("请输入数据库账户", env('MYSQL_USER', ''), true);
    $database_password = $this->helper->input("请输入数据库密码", env('MYSQL_PASSWORD', ''));


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
        $this->helper->warning($step1->msg);
        if ($this->helper->confirm("是否覆盖安装?")) {
          $overwrite = true;
          goto step1_result;
        } else {
          $this->helper->notice("取消安装");
          return self::FAILURE;
        }
      } else {
        $this->helper->failed($step1->msg);
        if ($this->helper->confirm("重试?", true)) {
          goto step1;
        } else {
          $this->helper->notice("取消安装");
          return self::FAILURE;
        }
      }
    }

    if ($can_use_env) {
      if ($use_env) {
        $this->helper->notice("数据库连接信息和 .env 配置相同, 将使用 .env 配置.");
      } else {
        $this->helper->notice("数据库连接信息与 webman 配置不同, 将使用 .env 文件的 ADMIN_MYSQL_* 配置.");
        save_env_file:
        $result = $this->saveEnv(
          $database_host,
          $database_port,
          $database_name,
          $database_user,
          $database_password,
        );
        if ($result) {
          $this->helper->success(".env 文件写入成功");
        } else {
          $this->helper->failed(".env 文件写入失败");
          if ($this->helper->confirm('重试?', true)) {
            goto save_env_file;
          } else {
            $this->helper->notice("取消安装");
            return self::FAILURE;
          }
        }
      }
      save_database_config:
      if ($this->writeConfigDatabasePhp($use_env ? 'MYSQL' : 'ADMIN_MYSQL')) {
        $this->helper->success("配置文件 plugin/admin/config/database.php 写入成功");
      } else {
        $this->helper->failed("配置文件 plugin/admin/config/database.php 写入失败");
        $this->helper->notice("请检查 config/database.php 文件是否有权限");
        if ($this->helper->confirm('是否重试?', true)) {
          goto save_database_config;
        } else {
          $this->helper->notice("取消安装");
          return self::FAILURE;
        }
      }
    }

    $reload_server = posix_kill($this->getServerPid(), SIGUSR1);
    if (!$reload_server) {
      $this->helper->warning("重载 webman 服务失败");
    } else {
      $this->helper->success("重载 webman 服务成功");
    }

    $this->helper->success("数据库安装完成, 开始设置管理员账号");


    step2:
    step2_username:
    $username = $this->helper->input("请输入管理员用户名", bin2hex(random_bytes(6)));
    step2_password:
    $default_admin_password = bin2hex(random_bytes(8));
    $password = $this->helper->input("请输入管理员的密码", $default_admin_password, hiding: true);
    $password2 = $this->helper->input("请再输入管理员密码", $default_admin_password, hiding: true);
    if ($password != $password2) {
      $this->helper->warning("两次密码不一致");
      if ($this->helper->confirm("重试?", true)) {
        goto step2_password;
      } else {
        $this->helper->notice("取消安装");
        return self::FAILURE;
      }
    }

    $step2 = $this->executeStep2($username, $password);
    if ($step2->code != 0) {
      $this->helper->failed($step2->msg);
      if ($this->helper->confirm("是否重试?", true)) {
        goto step2;
      } else {
        $this->helper->notice("取消安装");
        return self::FAILURE;
      }
    }

    $this->helper->notice("管理员账号设置完成");

    $this->helper->info([
      '请牢记以下信息:',
      '管理员用户名: ' . $username,
      '管理员密码:   ' . $password
    ]);

    $this->helper->success('安装完成');
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
    $group = 'ADMIN_MYSQL'
  )
  {
    $file = base_path('.env');
    $content = file_get_contents($file);
    if (str_contains($content, "{$group}_HOST")) {
      $content = preg_replace("/{$group}_HOST=(.*)/", "{$group}_HOST={$database_host}", $content);
    } else {
      $content .= "\n";
      $content .= "{$group}_HOST={$database_host}\n";
    }
    if (str_contains($content, "{$group}_PORT")) {
      $content = preg_replace("/{$group}_PORT=(.*)/", "{$group}_PORT={$database_port}", $content);
    } else {
      $content .= "{$group}_PORT={$database_port}\n";
    }
    if (str_contains($content, "{$group}_DBNAME")) {
      $content = preg_replace("/{$group}_DBNAME=(.*)/", "{$group}_DBNAME={$database_name}", $content);
    } else {
      $content .= "{$group}_DBNAME={$database_name}\n";
    }
    if (str_contains($content, "{$group}_USER")) {
      $content = preg_replace("/{$group}_USER=(.*)/", "{$group}_USER={$database_user}", $content);
    } else {
      $content .= "{$group}_USER={$database_user}\n";
    }
    if (str_contains($content, "{$group}_PASSWORD")) {
      $content = preg_replace("/{$group}_PASSWORD=(.*)/", "{$group}_PASSWORD={$database_password}", $content);
    } else {
      $content .= "{$group}_PASSWORD={$database_password}\n";
    }
    if ($group != 'MYSQL') {
      $env = file_get_contents(base_path('plugin/admin/.env.example'));
      $confirm = '检测到未使用默认的数据库配置前缀, 是否将 webman/admin 的配置前缀示例写入 .env.example 文件?';
      if (!str_contains($env, $group) && $this->helper->confirm($confirm, true)) {

      }
    }

    return file_put_contents($file, $content);
  }

}
