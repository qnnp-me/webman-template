<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

return [
  'default'     => 'mysql',
  'connections' => [
    'mysql' => [
      'driver'    => 'mysql',
      'host'      => env('MYSQL_HOST'),
      'port'      => env('MYSQL_PORT', '3306'),
      'database'  => env('MYSQL_DBNAME'),
      'username'  => env('MYSQL_USER'),
      'password'  => env('MYSQL_PASSWORD'),
      'charset'   => 'utf8mb4',
      'collation' => 'utf8mb4_general_ci',
      'prefix'    => '',
      'strict'    => true,
      'engine'    => null,
    ],
  ]
];
