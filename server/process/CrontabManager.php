<?php

namespace process;

use Workerman\Crontab\Crontab;

class CrontabManager
{
  function onWorkerStart(): void
  {
    // 每分钟执行一次
    new Crontab('0 */1 * * * *', function () {
    });
    // 每小时执行一次
    new Crontab('0 30 */1 * * *', function () {
    });
  }
}
