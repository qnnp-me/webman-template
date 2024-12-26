<?php

namespace app\controller;

use Exception;
use support\exception\BusinessException;
use support\Request;
use support\Response;
use Webman\RateLimiter\Annotation\RateLimiter;

class InfoController
{
  #[RateLimiter(limit: 1, ttl: 5, message: "请求次数过多")]
  function index(Request $request): Response
  {
    ob_start();
    if (!env('APP_DEBUG')) {
      phpinfo(INFO_LICENSE);
    } else {
      phpinfo(INFO_ALL);
    }
    $info = ob_get_contents();
    ob_end_clean();
    return response("<pre>$info</pre>");
  }

  function businessException()
  {
    throw new BusinessException("Message", 500, new \Exception("sss"));
  }

  function exception()
  {
    throw new Exception("Message", 500, new \Exception("sss"));
  }
}