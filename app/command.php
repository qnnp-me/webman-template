<?php

namespace app;

use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;

trait command
{
  protected InputInterface $input;
  protected OutputInterface $output;

  protected function info(string $message)
  {
    $this->writeln("[info] $message");
  }

  protected function warn(string $message)
  {
    $this->writeln("[warn] $message");
  }

  protected function fail(string $message)
  {
    $this->writeln("[fail] $message");
  }

  protected function erro(string $message)
  {
    $this->writeln("[erro] $message");
  }

  protected function writeln(string $message): void
  {
    $this->output->writeln($message);
  }

  protected function write(string $message): void
  {
    $this->output->write($message);
  }

  protected function confirm(string $question, bool $default = false): bool
  {
    /* @var QuestionHelper $helper */
    $helper = $this->getHelper('question');
    $question = new ConfirmationQuestion("[ques] $question", $default);
    return $helper->ask($this->input, $this->output, $question);
  }
}
