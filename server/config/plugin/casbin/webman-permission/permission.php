<?php
/**
 * @desc permission.php 描述信息
 * @author Tinywan(ShaoBo Wan)
 * @date 2022/01/12 20:20
 */
return [
    'default' => 'rbac-domain',
    'rbac-domain' => [
        'model' => [
            'config_type' => 'file',
            'config_file_path' => config_path() . '/plugin/casbin/webman-permission/rbac-domain-model.conf',
            'config_text' => '',
        ],
         'adapter' => Casbin\WebmanPermission\Adapter\LaravelDatabaseAdapter::class,
        'database' => [
            'connection' => '',
            'rules_table' => 'casbin_rule',
            'rules_name' => null
        ],
    ],
];