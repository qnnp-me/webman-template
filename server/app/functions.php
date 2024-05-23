<?php

use app\module\SessionModule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use support\Response;

function json_error(string $msg, int $code = 500, $data = null): Response
{
  $debug = env('APP_DEBUG');
  $result = [
    'code' => $code,
    'msg' => $msg,
  ];
  if ($data) {
    $result['data'] = $data;
  }
  if ($debug) {
    $result['debug'] = [
      'data' => request()->all(),
      'header' => request()->header(),
    ];
  }
  // if $code is between http status code range with it else return 500
  return json($result)->withStatus(($code >= 100 && $code < 600) ? $code : 500);
}

function json_success(mixed $data = null): Response
{
  if ($data instanceof LengthAwarePaginator) {
    return json([
      'data' => $data->items(),
      'count' => $data->total(),
    ]);
  }
  return json($data);
}

function cors(Response $response): Response
{
  if (request()->method() == 'OPTIONS') {
    return response('');
  }
  return $response->withHeaders([
    'Access-Control-Allow-Origin' => request()->header('Origin'),
    'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Allow-Headers' => request()->header('Access-Control-Request-Headers'),
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
