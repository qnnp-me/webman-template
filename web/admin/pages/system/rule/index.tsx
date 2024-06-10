import { useEffect, useRef, useState } from 'react';

import { App, Badge, Divider, Popconfirm, Space, Switch, Tooltip } from 'antd';
import Button from 'antd/es/button';
import Dropdown from 'antd/es/dropdown/dropdown';

import { AdminSystemRuleForm } from '@admin/pages/system/rule/_index/components/AdminSystemRuleForm.tsx';
import {
  ApiDeleteAdminRule,
  ApiGetAdminRuleTree,
  ApiUpdateAdminRule,
} from '@admin/pages/system/rule/_index/utils/ApiAppAdminRule.ts';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProTable } from '@ant-design/pro-components';
import { Icon } from '@common/basic/components/Icon/Icon.tsx';
import { TableEditableCell } from '@common/basic/components/TableEditableCell';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';
import { AntdIconType, ProColumnsType } from '@common/basic/types/antd';

export default function PageAdminSystemRule() {
  const [withWebmanAdmin, setWithWebmanAdmin] = useState(false);
  const { updateAdminUserInfo, hasAdminPermission, isSuperAdmin } = useAdminUserStorage();
  const { message, modal } = App.useApp();
  const [editData, setEditData] = useState<AdminMenuItemType>();
  const handleAdd = () => setEditData({} as AdminMenuItemType);
  const table = useRef<ActionType>();
  const columns: ProColumnsType<AdminMenuItemType> = [
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
      width: 250,
      render: (title, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
            <Icon icon={record.icon as AntdIconType | LayuiIconType}/>
              &nbsp;
              {title}
            </span>
            <Badge
              text={['目录', '菜单', '权限'][record.type]}
              color={['blue', 'green', 'red'][record.type]}
              styles={{
                root: {
                  transform: 'scale(0.7)',
                  transformOrigin: 'left',
                },
                indicator: {
                  transform: `scale(${1 / 0.7})`,
                  transformOrigin: 'left',
                },
              }}
            />
          </div>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'weight',
      search: false,
      width: 110,
      render: (weight, record) =>
        <TableEditableCell.Number
          value={weight}
          onSave={(value) => {
            ApiUpdateAdminRule({
              ...record,
              weight: value as number,
            })
              .then(() => {
                table.current?.reload();
                updateAdminUserInfo();
              })
              .catch(e => {
                message.error(e.msg);
              });
          }}
        />,
    },
    {
      title: '操作',
      width: 220,
      align: 'right',
      render: ((record: AdminMenuItemType) => <Space
        split={<Divider type={'vertical'}/>}
        onClick={e => e.preventDefault()}
      >
        {record.type == 1 && hasAdminPermission('app.admin.rule.insert') && <a
          onClick={e => {
            setEditData({
              pid: record.id,
              type: 2,
            } as never);
            e.stopPropagation();
            e.preventDefault();
          }}
        >添加权限</a>}
        {record.type == 0 && hasAdminPermission('app.admin.rule.insert') &&
          <span onClick={e => e.stopPropagation()}><Dropdown
            menu={{
              items: [
                {
                  key: 'add-submenu',
                  label: '添加子菜单',
                  onClick: () => {
                    setEditData({
                      pid: record.id,
                      type: 1,
                    } as never);
                  },
                },
                {
                  key: 'add-subfolder',
                  label: '添加子目录',
                  onClick: () => {
                    setEditData({
                      pid: record.id,
                      type: 0,
                    } as never);
                  },
                },
              ],
            }}
          >
            <a onClick={e => e.stopPropagation()}>添加</a>
          </Dropdown></span>
        }
        {hasAdminPermission('app.admin.rule.update') && <a
          onClick={e => {
            setEditData(record as never);
            e.stopPropagation();
            e.preventDefault();
          }}
        >编辑</a>}
        {hasAdminPermission('app.admin.rule.delete') && <Popconfirm
          title={`确定删除 [${record.title}] 吗？`}
          onPopupClick={e => e.stopPropagation()}
          onConfirm={() => {
            ApiDeleteAdminRule(record.id).then(() => {
              message.success('删除成功');
              table.current?.reload();
            });
          }}
        >
          <a onClick={e => e.stopPropagation()}>删除</a>
        </Popconfirm>}
      </Space>) as never,
    },
    {},
  ];

  useEffect(() => {
    requestAnimationFrame(() => table.current?.reload(true));
  }, [withWebmanAdmin]);

  return <ProCard>
    <ProTable<AdminMenuItemType>
      bordered
      actionRef={table}
      search={false}
      rowKey={'id'}
      scroll={{
        x: columns.reduce((acc, cur) => acc + Number((cur.width || 0)), 0),
      }}
      options={{
        // density:false,
      }}
      toolbar={{
        search: <Space>
          {hasAdminPermission('app.admin.rule.insert') && <Button
            type={'primary'}
            icon={<PlusOutlined/>}
            key={'add'}
            onClick={handleAdd}
          >新增菜单/权限</Button>}
        </Space>,
        actions: [
          <Space>
            {import.meta.env.DEV && isSuperAdmin && <Switch
              checkedChildren={'显示 WA 菜单'}
              unCheckedChildren={'隐藏 WA 菜单'}
              value={withWebmanAdmin}
              onChange={e => requestAnimationFrame(() => setWithWebmanAdmin(e))}
            ></Switch>}
            {import.meta.env.DEV && isSuperAdmin &&
              <Tooltip title={<span>将 Webman Admin 相关菜单移动到框架相关目录中.<br/>如 WA 的 "权限管理 &gt; 菜单管理" 下的权限移动到框架的菜单 "系统设置 &gt; 菜单和权限" 中</span>}>
                <Button
                  icon={<Icon icon={'ExportOutlined'}/>}
                  size={'small'}
                  onClick={() => modal.confirm({
                    title: '移动 WA 菜单',
                    content: '确定移动 WA 菜单吗？',
                    onOk: () => {
                    },
                  })}
                >移动 WA 菜单</Button>
              </Tooltip>}
          </Space>,
        ],
      }}
      expandable={{
        expandRowByClick: true,
      }}
      columns={columns}
      request={async () => {
        const data = await ApiGetAdminRuleTree(withWebmanAdmin);
        return ({
          data,
          success: true,
        });
      }}
      pagination={false}
    />
    <AdminSystemRuleForm
      withWebmanAdmin={withWebmanAdmin}
      editData={editData as AdminMenuItemType}
      onFinish={() => {
        table.current?.reload();
        updateAdminUserInfo();
        setEditData(undefined);
      }}
      onCancel={() => {
        setEditData(undefined);
      }}
    />
  </ProCard>;
}

