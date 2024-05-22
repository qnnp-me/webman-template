<?php

namespace app\model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use plugin\admin\app\model\User;
use support\Model;

/**
 * 微信用户
 * @property string $openid
 * @property string $unionid
 * @property string $user_id
 * @property string $headimgurl
 * @property string $nickname
 */
class OpenUserModel extends Model
{
  protected $table = 'open_users';
  protected $guarded = [];

  function user(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }

  function openAccount(): BelongsTo
  {
    return $this->belongsTo(OpenAccountModel::class, 'app_id', 'app_id');
  }
}
