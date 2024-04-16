<?php

namespace app\admin\controller;

use app\model\OpenSettingModel;
use support\Request;
use support\Response;

class OpenSettingController
{
  function list(Request $request): Response
  {
    $account_id = $request->get('id');
    $result = OpenSettingModel::where('account_id', $account_id)->get()->toArray();
    return json_response([
      'data' => $result,
      'code' => 0,
      'msg'  => 'ok',
    ]);
  }
}
