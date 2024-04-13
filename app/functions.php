<?php

use support\Response;

function json_error(string $msg, int $code = 500): Response
{
  $debug = env('APP_DEBUG');
  $result = [
    'code' => $code,
    'msg'  => $msg,
  ];
  if ($debug) {
    $result['debug'] = [
      'data'   => request()->all(),
      'header' => request()->header(),
    ];
  }
  // if $code is between http status code range with it else return 500
  return json($result)->withStatus(($code >= 100 && $code < 600) ? $code : 500);
}

function json_response(mixed $data = null): Response
{
  return json($data);
}

function cors(callable $callback)
{
  if (request()->method() == 'OPTIONS') {
    $result = response('');
  } else {
    $result = $callback();
  }
  return $result->withHeaders([
    'Access-Control-Allow-Origin'      => request()->header('Origin'),
    'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers'     => request()->header('Access-Control-Request-Headers'),
    'Access-Control-Allow-Credentials' => 'true',
  ]);
}
