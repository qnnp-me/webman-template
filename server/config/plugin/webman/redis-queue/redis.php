<?php
return [
  'default' => [
    'host' => 'redis://' . env('REDIS_HOST', '127.0.0.1') . ':' . env('REDIS_PORT', 6379),
    'options' => [
      'auth' => env('REDIS_PASSWORD'),       // 密码，字符串类型，可选参数
      'db' => 0,            // 数据库
      'prefix' => env('APP_NAME', 'Webman') . '_',
      'max_attempts' => 5, // 消费失败后，重试次数
      'retry_seconds' => 5, // 重试间隔，单位秒
    ]
  ],
];
