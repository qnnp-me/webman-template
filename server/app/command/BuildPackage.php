<?php

namespace app\command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class BuildPackage extends Command
{
  protected static $defaultName = 'build:package';
  protected static $defaultDescription = 'build package';

  /**
   * @return void
   */
  protected function configure(): void
  {
    $this->setHelp("用于 webman 构建的时候如果不包含 public 目录，会自动复制主 public 目录和插件 public 目录还有bin或者phar文件至 build/package 目录");
  }

  /**
   * @param InputInterface $input
   * @param OutputInterface $output
   * @return int
   */
  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $package_path = base_path('build/package');
    $main_public_path = base_path('public');
    $plugin_path = base_path('plugin');
    return self::SUCCESS;
  }

}
