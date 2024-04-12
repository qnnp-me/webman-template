<?php

namespace app\command;

use SebastianBergmann\Diff\Differ;
use SebastianBergmann\Diff\Output\StrictUnifiedDiffOutputBuilder;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;


class UpdateAdmin extends Command
{
  protected static string $defaultName = 'update:admin';
  protected static string $defaultDescription = 'Update webman/admin plugin';
  protected string $old_path;
  protected string $new_path;

  use \app\command;

  /**
   * @return void
   */
  protected function configure(): void
  {
    $this
      ->addOption('no-html', null, InputOption::VALUE_NEGATABLE, '忽略 HTML 文件')
      ->addOption('no-css', null, InputOption::VALUE_NEGATABLE, '忽略 CSS 文件')
      ->addOption('no-js', null, InputOption::VALUE_NEGATABLE, '忽略 JS 文件')
      ->addOption('no-json', null, InputOption::VALUE_NEGATABLE, '忽略 JSON 文件')
      ->addOption('no-php', null, InputOption::VALUE_NEGATABLE, '忽略 PHP 文件')
      ->addOption('delete', null, InputOption::VALUE_NEGATABLE, '删除手动增加的文件')
      ->addOption('save', 's', InputOption::VALUE_NEGATABLE, '将老的文件保存为 *.{datetime}.php');
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

    $old_path = base_path('plugin/admin');
    $new_path = base_path('vendor/webman/admin/src/plugin/admin');
    $this->old_path = $old_path;
    $this->new_path = $new_path;

    $builder = new StrictUnifiedDiffOutputBuilder([
      'collapseRanges'      => true,
      'commonLineThreshold' => 6,
      'contextLines'        => 3,
      'fromFile'            => '',
      'fromFileDate'        => null,
      'toFile'              => '',
      'toFileDate'          => null,
    ]);
    $differ = new Differ($builder);

    if (!$this->confirm("即将开始为 webman/admin 执行文件升级操作! 请小心处理! 是否继续? (Y/n)", true))
      return self::FAILURE;

    // 新旧文件列表
    $old_file_list = implode("\n", array_map(fn($path) => str_replace($old_path, '', $path), $this->getAllFiles(base_path('plugin/admin'))));
    $new_file_list = implode("\n", array_map(fn($path) => str_replace($new_path, '', $path), $this->getAllFiles(base_path('vendor/webman/admin/src/plugin/admin'))));

    // 读取删除模式
    $delete_mod = $input->getOption('delete');
    // 需要操作的文件列表
    $file_op_list = array_filter(explode("\n", $differ->diff($old_file_list, $new_file_list)), fn($path) => preg_match("#^[+\-]/.+#", $path));
    $del_file_list = array_filter($file_op_list, fn($path) => preg_match("#^-/.+#", $path));
    $new_file_list = array_filter($file_op_list, fn($path) => preg_match("#^\+/.+#", $path));
    if ($delete_mod) {
      $output->writeln("[info] 将要删除的文件:");
      print implode("\n", $del_file_list) . PHP_EOL;
      if ($this->confirm("确认要删除这些文件吗? (Y/n) ", true)) {
        foreach ($del_file_list as $file) {
          if ($this->delOldFile($file)) {
            $output->writeln("[info] 删除: $file -> ok");
          } else {
            $output->writeln("[fail] 删除: $file -> failed");
          }
        }
      }
    } else {
      $output->writeln("[info] 不会删除任何已有的文件.");
    }
    if (!!$new_file_list) {
      $output->writeln("[info] 将要新增的文件:");
      print implode("\n", $new_file_list) . PHP_EOL;
      if ($this->confirm("确认要新增这些文件吗? (Y/n) ", true)) {
        foreach ($new_file_list as $file) {
          if ($this->addNewFile($file)) {
            $output->writeln("[info] 新增: $file -> ok");
          } else {
            $output->writeln("[fail] 新增: $file -> failed");
          }
        }
      }
    } else {
      $output->writeln("[info] 没有新增任何文件.");
    }

    $output->writeln("[info] 升级完成.");
    return self::SUCCESS;
  }

  protected function getAllFiles(string $path): array
  {
    $list = [];
    if (file_exists($path) && is_dir($path)) {
      $dir = opendir($path);
      while (false !== ($file = readdir($dir))) {
        if ($file != "." && $file != "..") {
          if (is_dir($path . "/" . $file)) {
            $list = array_merge($list, $this->getAllFiles($path . "/" . $file));
          } else {
            $list[] = $path . "/" . $file;
          }
        }
      }
    } else {
      $list[] = $path;
    }
    return $list;
  }

  protected function addNewFile($file)
  {
    $file = preg_replace("#^\+#", "", $file);
    return copy($this->new_path . $file, $this->old_path . $file);
  }

  protected function delOldFile($file)
  {
    $file = preg_replace("#^-#", "", $file);
    return unlink($this->old_path . $file);
  }

}
