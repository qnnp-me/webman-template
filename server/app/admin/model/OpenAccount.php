<?php

namespace app\admin\model;

use plugin\admin\app\model\Base;

/**
 * @property integer $id (主键)
 * @property string $admin_id 管理员ID
 * @property string $app_id 应用ID
 * @property string $type 类型
 * @property string $description 描述
 * @property integer $enabled 是否启用
 * @property mixed $created_at 
 * @property mixed $updated_at
 */
class OpenAccount extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'open_accounts';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
    
    
    
}
