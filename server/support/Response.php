<?php

namespace support;
class Response extends \Webman\Http\Response
{
  public function __construct($status = 200, array $headers = array(), $body = '')
  {
    $headers += ['Content-Encoding' => 'gzip'];
    $body = $this->getGzipBody($body);
    parent::__construct($status, $headers, $body);
  }

  protected function getGzipBody(string $body): string
  {
    $body_hash = md5($body);
    if (!is_dir(runtime_path('gzip_cache'))) {
      mkdir(runtime_path('gzip_cache'));
    }
    $cache_file = runtime_path('gzip_cache/' . $body_hash . '.gz');
    if (file_exists($cache_file)) {
      $body = file_get_contents($cache_file) ?: '';
    } else {
      $body = gzencode($body);
      file_put_contents($cache_file, $body);
    }
    return $body;
  }

  public function withBody($body): Response
  {
    $body = $this->getGzipBody($body);
    return parent::withBody($body);
  }

  function getMimeTypeMap(): ?array
  {
    return self::$_mimeTypeMap;
  }
}