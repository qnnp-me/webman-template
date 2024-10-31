<?php

namespace support\abstract;

use support\interface\InitInterface;

abstract class InitAbstract implements InitInterface
{
  public int $weight = 10;
}