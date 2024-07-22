<?php

/**
 * 打包后运行时需要释放的文件配置
 */
return [
  'enable' => true,
  'list'   => [
    '.env.example'         => run_path(),
    'database/'            => runtime_path('phinx'),
    'public/'              => run_path(),
    'plugin/admin/public/' => run_path(),
  ],
];
