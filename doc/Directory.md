
### 文件路径: server/app/init/*

所有在此路径下含有`run`方法的类文件均会在项目启动时由`init`进程自动加载调用。

Example:

```php
<?php

// file path: app/init/Foo.php

namespace app\init;

class Foo
{
  public int $weight = 10; // 默认权重为10，数字越小越靠前执行

  function run(): void
  {
    ...
  }
}

```