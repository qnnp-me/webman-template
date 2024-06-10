<?php

namespace app\api\manage\controller;

use app\common\ControllerBasic;
use support\Request;
use support\Response;

class SettingController extends ControllerBasic
{
  function uploadLogo(Request $request): Response
  {
    $file = $request->file('file');
    if (!$file) {
      return json_error('请上传文件');
    }
    if (!$file->isValid()) {
      return json_error('上传文件无效');
    }
    $upload_path = public_path('upload/logo');
    if (!file_exists($upload_path)) {
      mkdir($upload_path, 0777, true);
    }
    $old_logo = $request->input('old_logo');
    $file_path = $upload_path . DIRECTORY_SEPARATOR . time() . '.' . $file->getUploadExtension();
    $file->move($file_path);
    if (str_starts_with($old_logo, '/upload/logo/')) {
      unlink(public_path($old_logo));
    }
    return json_success( '/upload/logo/' . basename($file_path));
  }
}