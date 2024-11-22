<?php

namespace app\api\manage\controller;

use support\Request;
use support\Response;

class DashboardController
{
  /**
   * 获取系统状态
   */
  function status(Request $request): Response
  {
    $base_path = run_path();
    $status_path = runtime_path('webman.status.' . time());
    shell_exec("sh -c \"cd {$base_path} && ./webman status > {$status_path} && rm -f $status_path\" > /dev/null 2>/dev/null &");
    $status_content = file_exists(runtime_path('webman.status')) ? file_get_contents(runtime_path('webman.status')) : '';
    $status_content = explode(PHP_EOL, $status_content);
    $processes = unserialize($status_content[0]);
    $status_content = implode(PHP_EOL, array_slice($status_content, 1));
    $status = [];
    if (strlen($status_content) > 100) {
      preg_match('#Workerman version:([0-9.a-zA-Z\-_]+).*PHP version:([0-9.a-zA-Z-_]+).*
*.*start time:([0-9\-]+ [0-9:]+) +run (.+hours).*
*.*load average: *([0-9,. ]+[0-9]).*event-loop:(.+[a-zA-Z]).*
*.*([0-9]+) *workers *([0-9]+) *processes#', $status_content, $matches);
      $status['workerman_version'] = $matches[1] ?? '';
      $status['php_version'] = $matches[2] ?? '';
      $status['start_time'] = $matches[3] ?? '';
      $status['run_duration'] = $matches[4] ?? '';
      // 三个系统负载（系统运行队列中的进程数）的样本数据，分别是 1 分钟、5 分钟和 15 分钟之前
      $status['load_average'] = array_map('floatval', array_map('trim', explode(',', $matches[5] ?? '')));
      $status['event_loop'] = $matches[6] ?? '';
      $status['worker_count'] = intval($matches[7] ?? '');
      $status['process_count'] = intval($matches[8] ?? '');
      $status['processes'] = $processes;
    }
    return json_success($status_content, [
      'status' => $status,
    ]);
  }
}