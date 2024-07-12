import { useEffect, useRef } from 'react';

import { App } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/lib';

import { ApiUpdateAppAdminConfig } from '@admin/pages/system/setting/_index/utils/ApiAppAdminConfig.ts';
import { ApiUploadManageSettingUploadLogo } from '@admin/pages/system/setting/_index/utils/ApiManageSetting.ts';
import { BetaSchemaForm, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';
import { BetaSchemaColumnType } from '@common/basic/types/antd';

export const AdminSystemSettingTabBasic = () => {
  const { sysConfig, updateAdminUserInfo } = useAdminUserStorage();
  const form = useRef<ProFormInstance>();
  const { modal, message } = App.useApp();
  useEffect(() => {
    requestAnimationFrame(() => form.current?.resetFields());
  }, [sysConfig]);
  return <div>
    <BetaSchemaForm<SysConfigType['logo']>
      isKeyPressSubmit
      style={{
        maxWidth: '500px',
      }}
      onFinish={async (values: Omit<SysConfigType['logo'], 'image'> & {
        image: string | UploadChangeParam | UploadFile | undefined
      }) => {
        try {
          if ((values.image as UploadChangeParam | undefined)?.fileList && (values.image as UploadChangeParam).fileList[0]) {
            values.image = await ApiUploadManageSettingUploadLogo({
              file: (values.image as UploadChangeParam).fileList[0].originFileObj as File,
              old_logo: sysConfig.logo.image,
            });
          }
          await ApiUpdateAppAdminConfig({ logo: values as SysConfigType['logo'] });
          void message.success('保存成功');
          void updateAdminUserInfo();
        } catch (e: unknown) {
          void message.error((e as Error).message);
        }
      }}
      layout={'horizontal'}
      labelCol={{ style: { width: '100px' } }}
      initialValues={sysConfig.logo}
      formRef={form}
      columns={[
        {
          title: '标题',
          dataIndex: 'title',
          formItemProps: {
            rules: [
              { required: true, message: '请输入标题' },
            ],
          },
        },
        {
          title: 'Logo',
          dataIndex: 'image',
          formItemProps: {
            rules: [
              { required: true, message: '请上传Logo' },
            ],
          },
          convertValue: (value: string | UploadChangeParam | UploadFile | undefined) => {
            if (!value) return [];
            if (Array.isArray(value)) {
              return value;
            }
            if ((value as UploadChangeParam | undefined)?.fileList) {
              return (value as UploadChangeParam).fileList;
            }
            return [
              {
                uid: '1',
                name: 'logo',
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
                  form.setFieldValue('image', undefined);
                  return false;
                },
                maxCount: 1,
                multiple: false,
                accept: 'image/*',
                onPreview: (file) =>
                  void modal.info({
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
                  }),
              }}
            />,
        },
        {
          title: 'ICP备案号',
          dataIndex: 'icp',
        },
        {
          title: '公安网备',
          dataIndex: 'beian',
        },
        {
          title: '公用页脚文字',
          dataIndex: 'footer_txt',
        },
      ] as BetaSchemaColumnType<SysConfigType['logo']>[]}
    />
  </div>;
};
