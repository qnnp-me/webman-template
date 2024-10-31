<?php

namespace app\command;

use support\helper\CommandHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class AppSetup extends Command
{
  protected static string $defaultName = 'app:setup';
  protected static string $defaultDescription = '用于项目部署初始化必要环境和配置';

  protected function configure()
  {
    $this->addArgument(
      'r',
      InputArgument::OPTIONAL,
      '是否重新生成证书，默认否'
    );
  }

  public function getHelp(): string
  {
    $command_helper = new CommandHelper();
    return $command_helper->color(' 用于项目部署初始化必要环境和配置 ', 231, 244);
  }

  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $generated = false;
    $regenerate = $input->getArgument('r');
    $command_helper = new CommandHelper();
    $command_helper->notice('创建 Jwt 证书');

    if (!is_dir(($jwt_key_dir = runtime_path('jwt_key')))) mkdir($jwt_key_dir, 0755, true);
    $jwt_access_private_key_path = runtime_path('jwt_key/access_private_key.key');
    $jwt_access_private_key_pub_path = runtime_path('jwt_key/access_private_key.key.pub');
    $jwt_refresh_private_key_path = runtime_path('jwt_key/refresh_private_key.key');
    $jwt_refresh_private_key_pub_path = runtime_path('jwt_key/refresh_private_key.key.pub');

    if ($regenerate || !file_exists($jwt_access_private_key_path)) {
      $command_helper->notice('生成 access 私钥');
      // ssh-keygen -t rsa -b 4096 -E SHA512 -m PEM -P "" -f RS512.key
      $access_private_key = openssl_pkey_new([
        'digest_alg'       => 'sha512',
        'private_key_bits' => 4096,
        'private_key_type' => OPENSSL_KEYTYPE_RSA,
      ]);
      openssl_pkey_export_to_file($access_private_key, $jwt_access_private_key_path);
      $access_public_key = openssl_pkey_get_details($access_private_key)['key'];
      file_put_contents($jwt_access_private_key_pub_path, $access_public_key);
      $generated = true;
    } else {
      $command_helper->info('access 私钥已存在，跳过生成');
    }
    if ($regenerate || !file_exists($jwt_refresh_private_key_path)) {
      $command_helper->notice('生成 refresh 私钥');
      $refresh_private_key = openssl_pkey_new([
        'digest_alg'       => 'sha512',
        'private_key_bits' => 4096,
        'private_key_type' => OPENSSL_KEYTYPE_RSA,
      ]);
      openssl_pkey_export_to_file($refresh_private_key, $jwt_refresh_private_key_path);
      $refresh_public_key = openssl_pkey_get_details($refresh_private_key)['key'];
      file_put_contents($jwt_refresh_private_key_pub_path, $refresh_public_key);
      $generated = true;
    } else {
      $command_helper->info('refresh 私钥已存在，跳过生成');
    }
    if ($generated) {
      $command_helper->success('证书生成成功');
    } else {
      $command_helper->info('证书已存在，无需生成');
    }
    return self::SUCCESS;
  }

}
