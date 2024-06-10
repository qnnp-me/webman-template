import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { App, Form, InputRef } from 'antd';

import {
  APiAddAdminRule,
  ApiGetAdminRuleFolderTree,
  ApiGetAdminRuleMenuTree,
  ApiUpdateAdminRule,
} from '@admin/pages/system/rule/_index/utils/ApiAppAdminRule.ts';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Icon } from '@common/basic/components/Icon/Icon.tsx';
import { IconSelector } from '@common/basic/components/Icon/IconSelector.tsx';
import { ModalEditForm } from '@common/basic/components/ModalEditForm.tsx';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';

let resetTimer: NodeJS.Timeout;
const pidLabel: {
  [key: number]: string
} = {};
const hiddeFields = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readTree = (tree: any[]) => {
  for (const node of tree) {
    pidLabel[node.id] = node.title;
    if (node.children?.length) {
      readTree(node.children);
    }
  }
};
export const AdminSystemRuleForm = ({ editData, onFinish, onCancel, withWebmanAdmin = false }: {
  withWebmanAdmin?: boolean
  editData: AdminMenuItemType
  onFinish: () => void
  onCancel: () => void
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateAdminUserInfo } = useAdminUserStorage();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [data, setData] = useState<AdminMenuItemType>(editData);
  const [type, setType] = useState<number>(editData?.type);
  useEffect(() => {
    setOpen(!!editData);
    if (editData) {
      resetTimer && clearTimeout(resetTimer);
      const _data = cloneDeep(editData);
      _data.type = _data.type === undefined ? 1 : _data.type;
      _data.pid = _data.pid || undefined as unknown as number;
      _data.key = _data.key || _data._key;
      setData(_data);
      setType(_data.type);
    }
  }, [editData]);
  useEffect(() => {
    if (!open) {
      resetTimer = setTimeout(() => {
        setData(undefined as unknown as AdminMenuItemType);
        onCancel();
      }, 200);
    }
  }, [open]);
  const [pidTree, setPidTree] = useState<AdminMenuItemType[]>([]);
  useEffect(() => {
    requestAnimationFrame(async () => {
      let result = [] as never;
      if (type === 2) {
        result = await ApiGetAdminRuleMenuTree(withWebmanAdmin) as never;
      } else {
        result = await ApiGetAdminRuleFolderTree(withWebmanAdmin) as never;
      }
      readTree(result);
      setPidTree(result);
    });
  }, [type]);
  const keyRef = useRef<InputRef>();
  return (
    <ModalEditForm<AdminMenuItemType>
      open={open}
      title={<span>{editData?.id ? '编辑' : '新增'}{[
        '目录',
        '菜单',
        '权限',
      ][data?.type]}&emsp;{editData?.pid ? `父级: ${pidLabel[editData.pid]}` : ''}</span>}
      form={form}
      editData={data}
      onFinish={async (values) => {
        values.pid = values.pid || 0;
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
        updateAdminUserInfo();
        onFinish();
        setOpen(false);
        message.success('操作成功');
      }}
      onCancel={() => {
        setOpen(false);
      }}
      labelCol={{ style: { width: '100px' } }}
      layout={'horizontal'}
      width={'min(500px, 96vw)'}
      onValuesChange={() => {
        const type = form.getFieldValue('type');
        if (type == 0) {
          const pid = form.getFieldValue('pid');
          const title = form.getFieldValue('title');
          form.setFieldValue('key', `${pid ? `${pidLabel[pid]}->` : ''}${title || ''}`);
        }
        if (type == 1) {
          form.setFieldValue('key', form.getFieldValue('href'));
        }
      }}
    >
      <ProFormText hidden name={'id'}/>
      <ProFormRadio.Group
        name={'type'}
        label={'类型'}
        radioType={'button'}
        hidden={hiddeFields && (!!data?.id || editData?.type !== undefined)}
        options={[
          { label: '目录', value: 0 },
          { label: '菜单', value: 1 },
          { label: '权限', value: 2 },
        ]}
        rules={[{ required: true, message: '请选择类型' }]}
        fieldProps={{
          onChange(e) {
            setType(e.target.value);
            form.setFieldValue('pid', undefined);
          },
        }}
      />
      <ProFormText name={'title'} label={'标题'} rules={[{ required: true, message: '请输入标题' }]}/>
      <ProFormDependency
        name={['type']}
      >
        {({ type }) =>
          <ProFormText
            hidden={hiddeFields && type < 2}
            name={'key'}
            label={'唯一标识'}
            rules={[{ required: true, message: '请输入唯一标识' }]}
            fieldProps={{
              ref: keyRef as never,
            }}
          />}
      </ProFormDependency>
      <ProFormDependency
        name={['type']}
      >
        {({ type }) => type == 1 &&
          <ProFormText
            name={'href'}
            label={`${['目录', '菜单', '权限'][type as never]}链接`}
            rules={[
              {
                required: type == 1,
                message: '请输入链接',
              },
            ]}
          />}
      </ProFormDependency>
      <ProFormDependency name={['type']}>
        {({ type }) => type < 2 && <ProForm.Item name={'icon'} label={'图标'}>
          <IconSelector/>
        </ProForm.Item>}
      </ProFormDependency>
      <ProFormTreeSelect
        // hidden={hiddeFields && !!editData?.pid}
        fieldProps={{
          treeData: pidTree,
          popupMatchSelectWidth: false,
          treeExpandAction: type == 2 ? 'click' : undefined,
          fieldNames: {
            label: 'title',
            value: 'id',
            children: 'children',
          },
          treeIcon: true,
          treeTitleRender: (node) => {
            if (node.icon && typeof node.icon === 'string') {
              node.icon = <Icon icon={node.icon}/>;
            }
            if (type == 2 && !!node.children?.length) {
              node.selectable = false;
            } else {
              node.selectable = true;
            }
            return node.title;
          },
        }}
        name={'pid'}
        label={'父级标识'}
      />
      <ProFormDigit fieldProps={{ step: 1, min: 0, changeOnWheel: true }} name={'weight'} label={'排序'}/>
    </ModalEditForm>
  );
};
