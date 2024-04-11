<?php

namespace app\command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class UpdateAdmin extends Command
{
  protected static string $defaultName = 'update:admin';
  protected static string $defaultDescription = 'Update webman/admin plugin';

  /**
   * @return void
   */
  protected function configure(): void
  {
    $this->addArgument('name', InputArgument::OPTIONAL, 'Name description');
  }

  /**
   * @param InputInterface $input
   * @param OutputInterface $output
   * @return int
   */
  protected function execute(InputInterface $input, OutputInterface $output): int
  {
    $name = $input->getArgument('name');
    $output->writeln('Hello update:admin');
    return self::SUCCESS;
  }

}
