<?php

return [
  'enable' => true,
  'jwt'    => [
    /** 算法类型 HS256、HS384、HS512、RS256、RS384、RS512、ES256、ES384、Ed25519 */
    'algorithms'               => 'RS512',
    /** access令牌秘钥 */
    'access_secret_key'        => file_exists(runtime_path('jwt_key/access_secret_key.key')) ? file_get_contents(runtime_path('jwt_key/access_secret_key.key')) : '',
    /** access令牌过期时间，单位：秒。默认 2 小时 */
    'access_exp'               => 7200,
    /** refresh令牌秘钥 */
    'refresh_secret_key'       => file_exists(runtime_path('jwt_key/refresh_secret_key.key')) ? file_get_contents(runtime_path('jwt_key/refresh_secret_key.key')) : '',
    /** refresh令牌过期时间，单位：秒。默认 7 天 */
    'refresh_exp'              => 604800,
    /** refresh 令牌是否禁用，默认不禁用 false */
    'refresh_disable'          => false,
    /** 令牌签发者 */
    'iss'                      => 'webman.tinywan.cn',
    /** 某个时间点后才能访问，单位秒。（如：30 表示当前时间30秒后才能使用） */
    'nbf'                      => 0,
    /** 时钟偏差冗余时间，单位秒。建议这个余地应该不大于几分钟 */
    'leeway'                   => 60,
    /** 是否允许单设备登录，默认不允许 false */
    'is_single_device'         => false,
    /** 缓存令牌时间，单位：秒。默认 7 天 */
    'cache_token_ttl'          => 604800,
    /** 缓存令牌前缀，默认 JWT:TOKEN: */
    'cache_token_pre'          => 'JWT:TOKEN:',
    /** 缓存刷新令牌前缀，默认 JWT:REFRESH_TOKEN: */
    'cache_refresh_token_pre'  => 'JWT:REFRESH_TOKEN:',
    /** 用户信息模型 */
    'user_model'               => function ($uid) {
      return [];
    },
    /** 是否支持 get 请求获取令牌 */
    'is_support_get_token'     => false,
    /** GET 请求获取令牌请求key */
    'is_support_get_token_key' => 'authorization',

    'access_private_key'  => file_exists(runtime_path('jwt_key/access_private_key.key')) ? file_get_contents(runtime_path('jwt_key/access_private_key.key')) : '',
    'access_public_key'   => file_exists(runtime_path('jwt_key/access_private_key.key.pub')) ? file_get_contents(runtime_path('jwt_key/access_private_key.key.pub')) : '',
    'refresh_private_key' => file_exists(runtime_path('jwt_key/refresh_private_key.key')) ? file_get_contents(runtime_path('jwt_key/refresh_private_key.key')) : '',
    'refresh_public_key'  => file_exists(runtime_path('jwt_key/refresh_private_key.key.pub')) ? file_get_contents(runtime_path('jwt_key/refresh_private_key.key.pub')) : '',
  ],
];
