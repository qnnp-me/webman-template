<?php

namespace app\api\open\controller;

use app\model\OpenUserModel;
use app\module\OpenModule;
use app\module\UserModule;
use Exception;
use plugin\admin\app\common\Util;
use plugin\admin\app\model\User as UserModel;
use support\Request;
use support\Response;
use think\facade\Validate;
use think\validate\ValidateRule as Rule;

class UserController
{
  protected $user_fields = [
    'id',
    'username',
    'nickname',
    'sex',
    'avatar',
    'email',
    'mobile',
    'level',
    'birthday',
    'money',
    'score',
    'last_time',
    'last_ip',
    'join_time',
    'join_ip',
    'role',
    'status',
  ];

  function loginByCode(Request $request): Response
  {
    $appid = $request->header('open_app_id');
    $validate = Validate::check(
      [
        ...  $request->post(),
        'open_app_id' => $request->header('open_app_id'),
      ],
      [
        'code'          => Rule::isRequire(msg: 'code不能为空'),
        'open_app_id' => Rule::isRequire(msg: 'header 中的 open_app_id不能为空'),
      ]);
    if (!$validate) {
      return json_error(400, Validate::getError());
    }
    $application = OpenModule::getApp($request->header('open_app_id'));
    try {
      $receive_user = $application->getOAuth()->userFromCode($request->post('code'));
    } catch (Exception $e) {
      // 微信端获取信息失败
      if (isset($e->body)) {
        return json_error($e->body['errcode'], $e->body['errmsg']);
      }
      return json_error(400, $e->getMessage());
    }
    $open_user_info = $receive_user->getRaw();
    $openid = $open_user_info['openid'];
    /* @var OpenUserModel $open_user */
    $open_user = OpenUserModel::updateOrCreate([
      'app_id' => $appid,
      'openid' => $openid,
    ], [
      'unionid'    => $open_user_info['unionid'],
      'headimgurl' => $open_user_info['headimgurl'],
      'nickname'   => $open_user_info['nickname'],
    ]);
    ss()->open_userSet($open_user);
    if (!$open_user->user_id) {
      return json_error(400, '用户未注册');
    } else {
      /**
       * @var UserModel $user
       */
      $user = $open_user->user;
    }

    $login = UserModule::login($user);

    if ($login === null) {
      return json_error(400, '未找到用户');
    }
    if ($login === false) {
      return json_error(400, '用户被禁用');
    }

    return json_response([
      'session' => $request->session()->getId(),
      'user'    => $user->only($this->user_fields),
    ]);
  }

  /**
   * 用当前微信用户信息注册并绑定新用户
   */
  function register(Request $request): Response
  {
    if ($request->method() !== 'POST') {
      return json_error(400, '请求方法不正确');
    }
    /**
     * @var OpenUserModel $open_user
     */
    $open_user = ss()->open_userGet();
    if (!$open_user) {
      return json_error(403, '用户未登录');
    }
    if ($open_user->user_id) {
      return json_error(400, '用户已绑定请先解绑');
    }
    Validate::check($request->post(), [
      'username' => Rule::isRequire(msg: '用户名不能为空')::min(4, '用户名不能少于4位'),
      'password' => Rule::isRequire(msg: '密码不能为空')::min(6, '密码不能少于6位'),
    ]);
    $username = $request->post('username');
    $password = $request->post('password');
    $nickname = $request->post('nickname', $open_user->nickname);
    $avatar = $request->post('avatar', $open_user->headimgurl);

    $user = new UserModel();
    $user->username = $username;
    $user->password = Util::passwordHash($password);
    $user->nickname = $nickname;
    $user->avatar = $avatar;
    $user->join_ip = request()->getRealIp();
    $user->join_time = date('Y-m-d H:i:s');
    $user->save();
    $open_user->user()->associate($user);
    $open_user->save();
    ss()->open_userSet($open_user);
    UserModule::login($user->id);

    return json_response([
      'session' => $request->session()->getId(),
      'user'    => $user->only($this->user_fields),
    ]);
  }

  /**
   * 用当前微信用户信息绑定已有用户
   */
  function bind(Request $request): Response
  {
    if ($request->method() !== 'POST') {
      return json_error(400, '请求方法不正确');
    }
    Validate::check($request->post(), [
      'username' => Rule::isRequire(msg: '用户名不能为空')::min(4, '用户名不能少于4位'),
      'password' => Rule::isRequire(msg: '密码不能为空')::min(6, '密码不能少于6位'),
    ]);
    /**
     * @var OpenUserModel $open_user
     */
    $open_user = ss()->open_userGet();
    if (!$open_user) {
      return json_error(403, '用户未登录');
    }
    if ($open_user->user_id) {
      return json_error(400, '用户已绑定请先解绑');
    }
    /* @var UserModel $user */
    $user = UserModel::where('username', $request->post('username'))->first();
    if (!$user) {
      return json_error(400, '用户不存在');
    }
    if ($user->status) {
      return json_error(400, '用户被禁用');
    }
    if (!UserModule::verify($user, $request->post('password'))) {
      return json_error(400, '密码错误');
    }
    $open_user->user()->associate($user);
    $open_user->save();
    ss()->open_userSet($open_user);
    UserModule::login($user);
    return json_response([
      'session' => $request->session()->getId(),
      'user'    => $user->only($this->user_fields),
    ]);
  }

}
