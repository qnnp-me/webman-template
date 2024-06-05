import { cloneDeep } from 'lodash';
import log from 'loglevel';
import { useRef, useState } from 'react';

import { App, Divider, Popconfirm, Space } from 'antd';
import Button from 'antd/es/button';

import { RuleForm } from '@admin/pages/system/rule/_components/RuleForm.tsx';
import {
  AdminRuleItemType,
  ApiDeleteAdminRule,
  ApiGetAdminRuleList,
} from '@admin/pages/system/rule/_utils/ApiAdminRule.ts';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProColumns, ProTable } from '@ant-design/pro-components';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';
import { arrayToTree } from '@common/basic/utils/utils.ts';

export default function PageAdminSystemRule() {
  const { updateAdminUserInfo } = useAdminUserStorage();
  const { message } = App.useApp();
  const [editData, setEditData] = useState<AdminMenuItemType>();
  const handleAdd = () => setEditData({} as AdminMenuItemType);
  const table = useRef<ActionType>();
  const columns: ProColumns<AdminMenuItemType>[] = [
    {
      title: '标题',
      dataIndex:'title',
      search: false,
      width: 200,
      fixed: 'left',
    },
    {
      title: '类型',
      dataIndex: 'type',
      search: false,
      width: 60,
      render: (type) => <>{['目录', '菜单', '权限'][type as never]}</>,
    },
    {
      title: '链接',
      dataIndex: 'href',
      search: false,
      width: 300,
    },
    {
      title: '唯一标识',
      dataIndex: 'key',
      width: 300,
      search: false,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: ((record: AdminMenuItemType) => <Space split={<Divider type={'vertical'}/>}>
        <a
          onClick={e => {
            setEditData(record as never);
            e.stopPropagation();
            e.preventDefault();
          }}
        >编辑</a>
        <Popconfirm
          title={'确定删除吗？'}
          onPopupClick={e => e.stopPropagation()}
          onConfirm={() => {
            ApiDeleteAdminRule(record.id).then(() => {
              message.success('删除成功');
              table.current?.reload();
            });
          }}
        >
          <a onClick={e => e.stopPropagation()}>删除</a>
        </Popconfirm>
      </Space>) as never,
    },
  ];

  return <ProCard>
    <ProTable<AdminMenuItemType>
      actionRef={table}
      search={false}
      rowKey={'id'}
      scroll={{
        x: columns.reduce((acc, cur) => acc + Number(cur.width), 0),
      }}
      toolbar={{
        search: <Button
          type={'primary'}
          icon={<PlusOutlined/>}
          key={'add'}
          onClick={handleAdd}
        >新增菜单/权限</Button>,
      }}
      expandable={{
        expandRowByClick: true,
      }}
      columns={columns}
      request={async (...args) => {
        const rawData = await ApiGetAdminRuleList();
        const data = arrayToTree<AdminRuleItemType>(cloneDeep(rawData)) as never;
        log.debug('request', args, 'data', data);
        return ({
          data,
          success: true,
        });
      }}
      pagination={false}
    />
    <RuleForm
      editData={editData as AdminMenuItemType}
      onFinish={() => {
        table.current?.reload();
        updateAdminUserInfo();
      }}
      onCancel={() => {
        setEditData(undefined);
      }}
    />
  </ProCard>;
}
