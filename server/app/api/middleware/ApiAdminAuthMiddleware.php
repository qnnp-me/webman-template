<?php

namespace app\api\middleware;

use plugin\admin\api\Middleware;
use Webman\Http\Request;
use Webman\Http\Response;

class ApiAdminAuthMiddleware extends Middleware
{
  public function process(Request $request, callable $handler): Response
  {
    if (str_starts_with($request->path(), '/api/manage')) {
      return parent::process($request, $handler);
    }
    return $handler($request);
  }
}