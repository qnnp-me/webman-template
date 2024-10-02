<?php

namespace app\cron;

class CleanGzipCacheCron
{
  # 每分钟检查一次 gzip 缓存, 缓存时间最长 5 分钟
  #[CronRule('*/1 * * * *')]
  function run(): void
  {
    $cache_dir = runtime_path('gzip_cache');
    if (!is_dir($cache_dir)) {
      return;
    }
    $files = scandir($cache_dir);
    $now = time();
    // gzip 缓存最长时间 5 分钟
    $expire = 5 * 60;
    foreach ($files as $file) {
      if (in_array($file, ['.', '..'])) {
        continue;
      }
      $file_path = $cache_dir . '/' . $file;
      if (is_file($file_path) && $now - filemtime($file_path) > $expire) {
        unlink($file_path);
      }
    }
  }
}