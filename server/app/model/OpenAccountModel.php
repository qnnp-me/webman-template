<?php

namespace app\model;

use Illuminate\Database\Eloquent\Relations\HasMany;
use support\Model;

/**
 * @property string $id
 * @property string $admin_id
 * @property string $app_id
 * @property string $type
 * @property string $description
 * @property string $created_at
 * @property string $updated_at
 */
class OpenAccountModel extends Model
{
  protected $table = 'open_accounts';
  protected $guarded = [];

  function settings(): HasMany
  {
    return $this->hasMany(OpenSettingModel::class, 'app_id', 'app_id');
  }
}
