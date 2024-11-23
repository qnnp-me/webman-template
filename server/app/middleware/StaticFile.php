<?php

namespace app\middleware;

use Webman\Http\Request;
use Webman\Http\Response;
use Webman\MiddlewareInterface;

class StaticFile implements MiddlewareInterface
{
  public function process(Request $request, callable $handler): Response
  {
    if (str_contains($request->path(), '/.')) {
      return response('<h1>403 forbidden</h1>', 403);
    }
    /** @var Response $response */
    $response = $handler($request);
    $content_encoding = $response->getHeader('Content-Encoding');
    if (!$content_encoding && $response->file) {
      $new_response = new \support\Response($response->getStatusCode(), $response->getHeaders(), $response->rawBody());
      $new_response->file = $response->file;
      $file_path = $new_response->file['file'];
      $file_info = pathinfo($file_path);
      $content_type = $new_response->getMimeTypeMap()[$file_info['extension']] ?? mime_content_type($file_path);
      $offset = $new_response->file['offset'];
      $length = $new_response->file['length'];
      $body = file_get_contents(
        $file_path,
        offset: $offset,
        length: $length ?: null
      );
      $new_response->file = null;
      $new_response
        ->withBody($body)
        ->withHeader('Content-Type', $content_type);
      $response = $new_response;
    }
    return $response;
  }
}
