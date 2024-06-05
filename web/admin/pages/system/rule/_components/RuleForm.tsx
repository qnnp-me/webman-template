import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

import { App, Form } from 'antd';

import {
  APiAddAdminRule,
  ApiGetAdminRuleTree,
  ApiUpdateAdminRule,
} from '@admin/pages/system/rule/_utils/ApiAdminRule.ts';
import {
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { ModalEditForm } from '@common/basic/components/ModalEditForm.tsx';

export const RuleForm = ({ editData, onFinish, onCancel }: {
  editData: AdminMenuItemType
  onFinish: () => void
  onCancel: () => void
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [data, setData] = useState<AdminMenuItemType>(editData);
  useEffect(() => {
    if (editData) {
      const _data = cloneDeep(editData);
      _data.type = _data.type || 1;
      _data.pid = _data.pid || undefined as unknown as number;
      setData(_data);
    } else {
      setData(undefined as unknown as AdminMenuItemType);
    }
  }, [editData]);
  return <ModalEditForm<AdminMenuItemType>
    title={`${editData?.id ? '编辑' : '新增'}菜单/权限`}
    form={form}
    editData={data}
    onFinish={async (values) => {
      try {
        if (values.id) {
          await ApiUpdateAdminRule(values);
        } else {
          await APiAddAdminRule(values);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        message.error(e.msg);
        return;
      }
      onFinish();
      setData(undefined as unknown as AdminMenuItemType);
      message.success('操作成功');
    }}
    onCancel={onCancel}
    labelCol={{ style: { width: '100px' } }}
    layout={'horizontal'}
    width={'min(500px, 96vw)'}
  >
    <ProFormText hidden name={'id'}/>
    <ProFormRadio.Group
      name={'type'}
      label={'类型'}
      radioType={'button'}
      options={[
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '权限', value: 2 },
      ]}
      rules={[{ required: true, message: '请选择类型' }]}
    />
    <ProFormText name={'title'} label={'标题'} rules={[{ required: true, message: '请输入标题' }]}/>
    <ProFormText name={'key'} label={'唯一标识'} rules={[{ required: true, message: '请输入唯一标识' }]}/>
    <ProFormDependency
      name={['type']}
    >
      {({ type }) => type < 2 && <ProFormText name={'href'} label={`${['目录', '菜单', '权限'][type as never]}链接`}/>}
    </ProFormDependency>
    <ProFormDependency name={['type']}>
      {({ type }) => type < 2 && <ProFormText name={'icon'} label={'图标'}/>}
    </ProFormDependency>
    <ProFormTreeSelect
      request={() => ApiGetAdminRuleTree()}
      fieldProps={{
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
      }}
      name={'pid'}
      label={'父级标识'}
    />
    <ProFormDigit fieldProps={{ step: 1, min: 0, changeOnWheel: true }} name={'weight'} label={'排序'}/>
  </ModalEditForm>;
};
