<?php

namespace app\module;

use DateTime;
use plugin\admin\app\model\User as UserModel;
use support\Cache;

class UserModule
{
  /**
   * 登录
   * @param string|UserModel $user_id
   * @return bool|null null 未找到, false 禁用, true 登录成功
   */
  static function login(string|UserModel $user_id): ?bool
  {
    if (!$user_id instanceof UserModel) {
      $user = UserModel::find($user_id);
    } else {
      $user = $user_id;
    }
    if (!$user) {
      return null;
    }
    if ($user->status) {
      return false;
    }
    $user->last_time = date('Y-m-d H:i:s');
    $user->last_ip = request()->getRealIp();
    $user->save();
    ss()->userSet($user);
    if (($device_id = request()->header('device_id')) && !Cache::get($device_id))
      Cache::set($device_id, $user->id, 7 * 24 * 3600);
    return true;
  }

  /**
   * 验证密码
   * @param string $user_id
   * @param string $password
   * @return bool|null null 未找到, false 密码错误, true 验证通过
   */
  static function verify(string|UserModel $user_id, string $password): ?bool
  {
    if (!$user_id instanceof UserModel) {
      $user = UserModel::find($user_id);
    } else {
      $user = $user_id;
    }
    if (!$user) {
      return null;
    }
    if (!password_verify($password, $user->password)) {
      return false;
    }
    return true;
  }

  /**
   * 注销
   */
  static function logout($all = false): void
  {
    if ($all) {
      Cache::set(ss()->userGet()->id . '.logout', time());
    }
    ss()->userDelete();
  }

  static function getUser(): ?UserModel
  {
    /**
     * @var UserModel $user
     */
//    $user = session()->get('user');
    $user = ss()->userGet();
    if (!$user) {
      return null;
    }
    $logout = Cache::get($user->id . '.logout');
    if ($logout && $logout > DateTime::createFromFormat('Y-m-d H:i:s', $user->last_time)->getTimestamp()) {
      self::logout();
      return null;
    }
    return $user;
  }
}
