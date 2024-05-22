<?php

namespace app\admin\controller;

use app\admin\model\OpenAccount;
use app\model\OpenSettingModel;
use plugin\admin\app\controller\Crud;
use support\Db;
use support\exception\BusinessException;
use support\Request;
use support\Response;

/**
 * 第三方平台管理
 */
class OpenAccountController extends Crud
{

  /**
   * @var OpenAccount
   */
  protected $model = null;
  protected $dataLimit = 'auth';

  /**
   * 构造函数
   * @return void
   */
  public function __construct()
  {
    $this->model = new OpenAccount;
  }

  /**
   * 浏览
   * @return Response
   */
  public function index(): Response
  {
    return view('open-account/index');
  }

  /**
   * 插入
   * @param Request $request
   * @return Response
   * @throws BusinessException
   */
  public function insert(Request $request): Response
  {
    if ($request->method() === 'POST') {
      $data = $this->insertInput($request);
      $data['admin_id'] = admin_id();
      $id = $this->doInsert($data);
      $settings = $request->post('value');
      Db::transaction(function () use ($settings, $id) {
        if (is_array($settings)) {
          foreach ($settings as $setting) {
            OpenSettingModel::updateOrCreate([
              'account_id' => $id,
              'field'      => $setting['field'],
            ], [
              'value' => $setting['value'],
            ]);
          }
        }
      });
      return $this->json(0, 'ok', ['id' => $id]);
    }
    return view('open-account/insert');
  }

  /**
   * 更新
   * @param Request $request
   * @return Response
   * @throws BusinessException
   */
  public function update(Request $request): Response
  {
    if ($request->method() === 'POST') {
      [$id, $data] = $this->updateInput($request);
      $this->doUpdate($id, $data);
      $settings = $request->post('value');
      $exists_settings = OpenSettingModel::where('account_id', $id)->get()->toArray();
      $exists_fields = array_column($exists_settings, 'field');
      if ($settings) {
        $delete_fields = array_diff($exists_fields, array_column($settings, 'field'));
        Db::transaction(function () use ($delete_fields, $settings, $id) {
          if (is_array($settings)) {
            foreach ($settings as $setting) {
              if (!$setting['field']) continue;
              OpenSettingModel::updateOrCreate([
                'account_id' => $id,
                'field'      => $setting['field'],
              ], [
                'value' => $setting['value'],
              ]);
            }
          }
          if (count($delete_fields)) {
            OpenSettingModel::where('account_id', $id)->whereIn('field', $delete_fields)->delete();
          }
        });
      } else {
        OpenSettingModel::where('account_id', $id)->whereIn('field', $exists_fields)->delete();
      }
      return $this->json(0);
    }
    return view('open-account/update');
  }

}
