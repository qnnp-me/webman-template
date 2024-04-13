<?php

namespace app\command;

use SebastianBergmann\Diff\Differ;
use SebastianBergmann\Diff\Output\UnifiedDiffOutputBuilder;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class WebmanAdminUpdate extends Command
{
  protected static string $defaultName = 'webman:admin:update';
  protected static string $defaultDescription = 'Update webman/admin plugin';
  protected string $old_path;
  protected string $new_path;

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

    $old_path = base_path('plugin/admin');
    $new_path = base_path('vendor/webman/admin/src/plugin/admin');
    $this->old_path = $old_path;
    $this->new_path = $new_path;

//    $builder = new StrictUnifiedDiffOutputBuilder([
//      'collapseRanges'      => true,
//      'commonLineThreshold' => 6,
//      'contextLines'        => 3,
//      'fromFile'            => '',
//      'fromFileDate'        => null,
//      'toFile'              => '',
//      'toFileDate'          => null,
//    ]);
    $builder = new UnifiedDiffOutputBuilder(
      "", // custom header
      true                      // do not add line numbers to the diff
    );
    $differ = new Differ($builder);

    $this->alert('即将开始为 webman/admin 执行文件升级操作! 请小心处理! ');

    // 新旧文件列表
    $old_file_list = array_map(fn($path) => str_replace($old_path, '', $path), $this->getAllFiles(base_path('plugin/admin')));
    $new_file_list = array_map(fn($path) => str_replace($new_path, '', $path), $this->getAllFiles(base_path('vendor/webman/admin/src/plugin/admin')));
    $old_file_list_str = implode("\n", $old_file_list);
    $new_file_list_str = implode("\n", $new_file_list);

    // 需要操作的文件列表
    $file_op_list = array_filter(explode("\n", $differ->diff($old_file_list_str, $new_file_list_str)), fn($path) => preg_match("#^[+\-]/.+#", $path));
    $del_file_list = array_filter($file_op_list, fn($path) => preg_match("#^-/.+#", $path));
    $new_file_list_str = array_filter($file_op_list, fn($path) => preg_match("#^\+/.+#", $path));
    if ($this->confirm('是否选择删除自定义的新文件?', true)) {
      $this->info(['将要操作删除的文件:', ...$del_file_list]);
      $all = false;
      foreach ($del_file_list as $file) {
        if (!$all) {
          $operation = $this->select('删除: ' . $file . ' 吗?', ['Y', 'n', 'all', 'noAll'], 0);
          if ($operation == 'n') {
            continue;
          }
          $all = $operation == 'all';
          if ($all) {
            $this->notice('已选择全部删除操作');
          }
          if ($operation == 'noAll') {
            $this->notice('已取消全部删除操作');
            break;
          }
        }
        if ($this->delOldFile($file)) {
          $this->success("删除: $file -> ok");
        } else {
          $this->failed("删除: $file -> failed");
        }
      }
    } else {
      $this->notice("不会删除任何已有的文件.");
    }
    if (!!$new_file_list_str) {
      $this->notice('将要新增的文件:');
      print implode("\n", $new_file_list_str) . PHP_EOL;
      foreach ($new_file_list_str as $file) {
        if ($this->addNewFile($file)) {
          $this->success("新增: $file -> ok");
        } else {
          $this->failed("新增: $file -> failed");
        }
      }
    } else {
      $this->notice("没有新增任何文件.");
    }

    foreach ($old_file_list as $file_path) {
      $new_file_path = $this->new_path . $file_path;
      if (!file_exists($new_file_path)) {
        continue;
      }
      $old_file_path = $this->old_path . $file_path;
      $old_file = file_get_contents($old_file_path);
      $new_file = file_get_contents($new_file_path);
      $diff = $differ->diff($old_file, $new_file);
      if ($diff) {
        $this->warning("文件 $file_path 存在差异");
        $diff = explode("\n", $diff);
        $_diff = $diff;
//        array_splice($diff, 0, 2);
        usort($_diff, fn($a, $b) => mb_strlen($b) - mb_strlen($a));
        $max_len = max(180, mb_strlen($_diff[0]));
        $diff = array_map(
          function ($line) use ($max_len) {
            $chars = mb_str_split($line);
            $fix = 0;
            foreach ($chars as $char) {
              $fix += strlen($char) > 2 ? 1 : 0;
            }
            $prefix = ' ';
            $line = mb_str_pad("$prefix$line", $max_len - $fix, ' ');
            return str_starts_with($line, "$prefix-")
              ? $this->color($line, 231, 196)
              : (str_starts_with($line, "$prefix+")
                ? $this->color($line, 231, 35)
                : $this->color($line, 7, 236));
          },
          $diff
        );
        $this->info($diff);
        if ($this->confirm("是否更新 $file_path ?", true)) {
          file_put_contents($old_file_path, $new_file);
          $this->success("更新: $file_path -> ok");
        } else {
          $this->notice("更新: $file_path -> skipped");
        }
      }
    }

    $this->success("升级完成.");
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

  protected function addNewFile($file): bool
  {
    $file = preg_replace("#^\+#", "", $file);
    return copy($this->new_path . $file, $this->old_path . $file);
  }

  protected function delOldFile($file): bool
  {
    $file = preg_replace("#^-#", "", $file);
    return unlink($this->old_path . $file);
  }

}
