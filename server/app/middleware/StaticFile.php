<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

namespace app\middleware;

use Webman\Http\Request;
use Webman\Http\Response;
use Webman\MiddlewareInterface;

/**
 * Class StaticFile
 * @package app\middleware
 */
class StaticFile implements MiddlewareInterface
{
  public function process(Request $request, callable $handler): Response
  {
    // Access to files beginning with. Is prohibited
    if (str_contains($request->path(), '/.')) {
      return response('<h1>403 forbidden</h1>', 403);
    }
    /** @var Response $response */
    $response = $handler($request);
    // Add cross domain HTTP header
    /*$response->withHeaders([
        'Access-Control-Allow-Origin'      => '*',
        'Access-Control-Allow-Credentials' => 'true',
    ]);*/
    $content_encoding = $response->getHeader('Content-Encoding');
    if (!$content_encoding && $response->file) {
      $new_response = new \support\Response($response->getStatusCode(),$response->getHeaders(),$response->rawBody());
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
        ->withHeader('Content-Encoding', 'gzip')
        ->withHeader('Content-Type', $content_type);
      $response = $new_response;
    }
    return $response;
  }
}
