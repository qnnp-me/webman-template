<?php

namespace app\api\controller;

use GuzzleHttp\Client;
use support\Request;
use support\Response;

class TestController
{
  function index(Request $request): Response
  {
    ob_start();
    phpinfo();
    $info = ob_get_contents();
    ob_end_clean();
    return response($info);
  }
  function request(Request $request): Response
  {
    $client = new Client();
    return response($client->get('https://www.baidu.com')->getBody()->getContents());
  }
}
