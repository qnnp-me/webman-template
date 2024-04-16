<?php

namespace app\module;

enum OpenTypeEnum: string
{
  case WechatOfficial = 'wechat_official';
  case WechatMini = 'wechat_mini';
  case WechatOpen = 'wechat_open';
  case WechatPay = 'wechat_pay';
  case WechatWork = 'wechat_work';
  case WechatOpenWork = 'wechat_open_work';
}
