<?php

namespace app\api\controller;

use Exception;
use support\exception\BusinessException;

class TestController
{
  function asd()
  {
    return json_error('test error');
  }
}