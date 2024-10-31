<?php

namespace support;
class Response extends \Webman\Http\Response
{
  private array $accept_encoding = [];

  public function __construct($status = 200, array $headers = array(), $body = '')
  {
    $this->accept_encoding = array_map('trim', explode(',', request()->header('Accept-Encoding') ?? ''));
    if (in_array('gzip', $this->accept_encoding)) {
      $headers += ['Content-Encoding' => 'gzip'];
      $body = $this->getGzipBody($body);
    }
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

  function getMimeTypeMap(): ?array
  {
    return self::$_mimeTypeMap;
  }

  public function withFile($file, $offset = 0, $length = 0)
  {
    if (!\is_file($file)) {
      return $this->withStatus(404)->withBody('<h3>404 Not Found</h3>');
    }
    $this->withBody(file_get_contents($file));
    return $this;
  }

  public function withBody($body): Response
  {
    if (in_array('gzip', $this->accept_encoding)) {
      $body = $this->getGzipBody($body);
    }
    return parent::withBody($body);
  }
}