<?php
return [
  'fast' => [
    'handler' => Webman\RedisQueue\Process\Consumer::class,
    'count' => cpu_count(), // 可以设置多进程同时消费
    'constructor' => [
      // 消费者类目录
      'consumer_dir' => app_path() . '/queue/redis/fast'
    ]
  ],
  'slow' => [
    'handler' => Webman\RedisQueue\Process\Consumer::class,
    'count' => cpu_count(), // 可以设置多进程同时消费
    'constructor' => [
      // 消费者类目录
      'consumer_dir' => app_path() . '/queue/redis/slow'
    ]
  ],
];