<?php
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
    ],
];