import { useEffect, useRef } from 'react';

import { App } from 'antd';

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
      onFinish={async values => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((values.image as any)?.fileList && (values.image as any).fileList[0]) {
            values.image = await ApiUploadManageSettingUploadLogo({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              file: (values.image as any).fileList[0].originFileObj,
              old_logo: sysConfig.logo.image,
            });
          }
          await ApiUpdateAppAdminConfig({ logo: values });
          message.success('保存成功');
          updateAdminUserInfo();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          message.error(e.msg);
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
