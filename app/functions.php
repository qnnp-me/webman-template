<?php

use app\module\SessionModule;
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

function cors(Response $response): Response
{
  if (request()->method() == 'OPTIONS') {
    return response('');
  }
  return $response->withHeaders([
    'Access-Control-Allow-Origin'      => request()->header('Origin'),
    'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Allow-Headers'     => request()->header('Access-Control-Request-Headers'),
    'Access-Control-Allow-Credentials' => 'true',
  ]);
}


function getAllFiles(string $abs_path): array
{
  $list = [];
  if (file_exists($abs_path) && is_dir($abs_path)) {
    $dir = opendir($abs_path);
    while (false !== ($file = readdir($dir))) {
      if ($file != "." && $file != "..") {
        if (is_dir($abs_path . "/" . $file)) {
          $list = array_merge($list, getAllFiles($abs_path . "/" . $file));
        } else {
          $list[] = $abs_path . "/" . $file;
        }
      }
    }
  } else {
    $list[] = $abs_path;
  }
  return $list;
}

function ss(): SessionModule
{
  return SessionModule::getInstance();
}
