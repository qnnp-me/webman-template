<?php

namespace support\attribute;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class CronRule
{
  /**
   * ```
   * 0   1   2   3   4   5
   * |   |   |   |   |   |
   * |   |   |   |   |   +------ day of week (0 - 6) (Sunday=0)
   * |   |   |   |   +------ month (1 - 12)
   * |   |   |   +-------- day of month (1 - 31)
   * |   |   +---------- hour (0 - 23)
   * |   +------------ min (0 - 59)
   * +-------------- sec (0-59)[可省略，如果没有0位,则最小时间粒度是分钟]
   * ```
   *
   * ---
   *
   * 每5秒执行一次: &#42;/5 * * * * *
   *
   * 每分钟的第一秒执行: `1 * * * * *`
   *
   * 每天的7点50执行，注意这里省略了秒位: `50 7 * * *`
   *
   * ---
   */
  public function __construct(string $rule)
  {
  }
}