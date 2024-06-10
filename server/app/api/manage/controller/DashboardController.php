<?php

namespace app\api\manage\controller;

use app\common\ControllerBasic;
use support\Request;
use support\Response;

class DashboardController extends ControllerBasic
{
  /**
   * 获取系统状态
   */
  function status(Request $request): Response
  {
    $base_path = run_path();
    $cache_key = md5($base_path) . '_dashboard_system_status';
    $status_path = runtime_path('webman.status.' . time());
    shell_exec("sh -c \"cd {$base_path} && ./webman status > {$status_path} && redis-cli -x set {$cache_key} < {$status_path} && rm -f $status_path\" > /dev/null 2>/dev/null &");
    $status_content = `redis-cli get {$cache_key}`;
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
      $status['load_average'] = array_map('floatval',array_map('trim', explode(',', $matches[5] ?? '')));
      $status['event_loop'] = $matches[6] ?? '';
      $status['worker_count'] = intval($matches[7] ?? '');
      $status['process_count'] = intval($matches[8] ?? '');
    }
    return json_success($status_content, ['status' => $status]);
  }

  function restart(Request $request): Response
  {
    $base_path = run_path();
    `exec sh -c "cd $base_path && ./webman reload" > /dev/null 2>/dev/null &`;
    return json_success();
  }
}