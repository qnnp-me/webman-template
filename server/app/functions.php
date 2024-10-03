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
  return json($result)->withStatus(($code >= 100 && $code < 600) ? $code : 500);
}

function json_success(mixed $data = null, array $extra = []): Response
{
  if ($data instanceof LengthAwarePaginator) {
    return json([
      'data' => $data->items(),
      'count' => $data->total(),
      ...$extra,
    ]);
  }
  return json([
    'data' => $data,
    ...$extra,
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

/**
 * @param string $path file or dir path
 * @param array|string $include Ex: `'*.php'` `['.php', '.js']` `['~^[A-Z].*\.php$~', '/\.js$/']`
 * @param array|string $exclude Ex: `'*.php'` `['.php', '.js']` `['~^[A-Z].*\.php$~', '/\.js$/']`
 * @return Generator
 */
function get_files(string $path, array|string $include = [], array|string $exclude = []): Generator
{
  if (!is_array($include)) $include = [$include];
  if (!is_array($exclude)) $exclude = [$exclude];
  if (is_file($path)) {
    yield $path;
  } else {
    $items = is_dir($path) ? scandir($path) : [];
    foreach ($items as $item) {
      if (in_array($item, ['.', '..'])) continue;
      $item_path = $path . DIRECTORY_SEPARATOR . $item;
      if (is_dir($item_path)) {
        yield from get_files($item_path, $include, $exclude);
      } else {
        $match_check = function (array $include, $item, bool $default = false) {
          foreach ($include as $i) {
            $is_preg = preg_match('~^([/#\~]).+([/#\~])$~', $i);
            if ($is_preg && preg_match($i, $item)) {
              return true;
            }
            $is_pan = !$is_preg && (str_starts_with($i, '*') || str_starts_with($i, '.'));
            if ($is_pan && str_ends_with($item, str_replace('*', '', $i))) {
              return true;
            }
            if ($i == $item) {
              return true;
            }
          }
          return $default;
        };
        $include_match = $match_check($include, $item, empty($include));
        $exclude_match = $match_check($exclude, $item, false);
        if ($include_match && $exclude_match) continue;
        if (!$include_match && !$exclude_match) continue;
        yield $item_path;
      }
    }
  }
}

function ss(): SessionModule
{
  return SessionModule::getInstance();
}
