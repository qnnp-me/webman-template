import {PlusOutlined} from '@ant-design/icons';
import {ActionType, ProCard, ProTable} from '@ant-design/pro-components';
import {App, Badge, Divider, Popconfirm, Space} from 'antd';
import Button from 'antd/es/button';
import Dropdown from 'antd/es/dropdown/dropdown';
import {useRef, useState} from 'react';

import {AdminSystemRuleForm} from '#admin/pages/system/rule/_index/components/AdminSystemRuleForm.tsx';
import {
  ApiDeleteAdminRule,
  ApiGetAdminRuleTree,
  ApiUpdateAdminRule,
} from '#admin/pages/system/rule/_index/utils/ApiAppAdminRule.ts';

import {AntdIconType, ProColumnsType} from '../../../../src/types/antd';

import {Icon} from '@basic/components/Icon/Icon.tsx';
import {TableEditableCell} from '@basic/components/TableEditableCell';
import useAdminUserStorage from '@basic/store/useAdminUserStorage.ts';

export default function PageAdminSystemRule() {
  const {updateAdminUserInfo, hasAdminPermission} =
    useAdminUserStorage();
  const {message} = App.useApp();
  const [editData, setEditData] = useState<AdminMenuItemType>();
  const handleAdd = () => {
    setEditData({} as AdminMenuItemType);
  };
  const table = useRef<ActionType>();
  const columns: ProColumnsType<AdminMenuItemType> = [
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
      width: 250,
      render: (title, record) => {
        return (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
                  transform: `scale(${(1 / 0.7) as unknown as string})`,
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
      render: (weight, record) => (
        <TableEditableCell.Number
          value={weight}
          onSave={(value) => {
            ApiUpdateAdminRule({
              ...record,
              weight: value as number,
            })
              .then(() => {
                void table.current?.reload();
                void updateAdminUserInfo();
              })
              .catch((e: unknown) => {
                void message.error((e as Error).message);
              });
          }}
        />
      ),
    },
    {
      title: '操作',
      width: 220,
      align: 'right',
      render: ((record: AdminMenuItemType) => (
        <Space
          split={<Divider type={'vertical'}/>}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {record.type == 1 && hasAdminPermission('app.admin.rule.insert') && (
            <a
              onClick={(e) => {
                setEditData({
                  pid: record.id,
                  type: 2,
                } as never);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              添加权限
            </a>
          )}
          {record.type == 0 && hasAdminPermission('app.admin.rule.insert') && (
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Dropdown
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
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  添加
                </a>
              </Dropdown>
            </span>
          )}
          {hasAdminPermission('app.admin.rule.update') && (
            <a
              onClick={(e) => {
                setEditData(record as never);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              编辑
            </a>
          )}
          {hasAdminPermission('app.admin.rule.delete') && (
            <Popconfirm
              title={`确定删除 [${record.title}] 吗？`}
              onPopupClick={(e) => {
                e.stopPropagation();
              }}
              onConfirm={() => {
                void ApiDeleteAdminRule(record.id).then(() => {
                  void message.success('删除成功');
                  void table.current?.reload();
                });
              }}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                删除
              </a>
            </Popconfirm>
          )}
        </Space>
      )) as never,
    },
    {},
  ];

  return (
    <ProCard>
      <ProTable<AdminMenuItemType>
        size={'small'}
        bordered
        actionRef={table}
        search={false}
        rowKey={'id'}
        scroll={{
          x: columns.reduce((acc, cur) => acc + Number(cur.width || 0), 0),
        }}
        options={{density: false}}
        toolbar={{
          search: <Space>
            {hasAdminPermission('app.admin.rule.insert') && (
              <Button
                type={'primary'}
                icon={<PlusOutlined/>}
                key={'add'}
                onClick={handleAdd}
                size={'small'}
              >
                新增菜单/权限
              </Button>
            )}
          </Space>,
        }}
        expandable={{
          expandRowByClick: true,
        }}
        columns={columns}
        request={() => ApiGetAdminRuleTree().then(data => (
          {
            data,
            success: true,
            total: data.length,
          }
        ))}
        pagination={false}
      />
      <AdminSystemRuleForm
        editData={editData as AdminMenuItemType}
        onFinish={() => {
          void table.current?.reload();
          void updateAdminUserInfo();
          setEditData(undefined);
        }}
        onCancel={() => {
          setEditData(undefined);
        }}
      />
    </ProCard>
  );
}
