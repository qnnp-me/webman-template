import { useEffect, useRef } from 'react';

import { App } from 'antd';

import { BetaSchemaForm, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';
import { BetaSchemaColumnsType } from '@common/basic/types/antd';

export const AdminMySettingTabBasic = () => {
  const { modal } = App.useApp();
  const { adminUserInfo } = useAdminUserStorage();
  const form = useRef<ProFormInstance>();
  useEffect(() => {
    requestAnimationFrame(() => form.current?.resetFields());
  }, [adminUserInfo]);
  return <BetaSchemaForm<AdminUserInfoType>
    formRef={form}
    style={{ maxWidth: '500px' }}
    initialValues={adminUserInfo}
    layout={'horizontal'}
    labelCol={{ style: { width: '100px' } }}
    columns={[
      {
        title: '头像',
        dataIndex: 'avatar',
        formItemProps: {
          rules: [
            { required: true, message: '请上传头像' },
          ],
        },
        convertValue: (value) => {
          if (!value) return [];
          if (Array.isArray(value)) {
            return value;
          }
          if (value.fileList) {
            return value.fileList;
          }
          return [
            {
              uid: '1',
              name: 'avatar',
              status: 'done',
              url: value,
            },
          ];
        },
        renderFormItem: (_schema, _config, form, _action) =>
          <ProFormUploadButton
            fieldProps={{
              listType: 'picture-card',
              beforeUpload: () => {
                return false;
              },
              onRemove() {
                form.setFieldValue(_schema.dataIndex||_schema.name, undefined);
                return false;
              },
              maxCount: 1,
              multiple: false,
              accept: 'image/*',
              onPreview: (file) => {
                modal.info({
                  icon: null,
                  width: 'max-content',
                  height: 'max-content',
                  centered: true,
                  styles: {
                    body: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    footer: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  },
                  footer: null,
                  maskClosable: true,
                  closable: true,
                  content: <img src={file.url || URL.createObjectURL(file.originFileObj as File)}/>,
                });
              },
            }}
          />,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        formItemProps: {
          rules: [
            { required: true, message: '请输入昵称' },
          ],
        },
      },
      {
        title: '用户名',
        dataIndex: 'username',
        formItemProps: {
          rules: [
            { required: true, message: '请输入用户名' },
          ],
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
    ] as BetaSchemaColumnsType<AdminUserInfoType>}
  />;
};
