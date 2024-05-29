import axios from 'axios';
import log from 'loglevel';
import { useRef, useState } from 'react';

import { notification } from 'antd';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { Rule } from 'rc-field-form/es/interface';

import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Captcha, refreshCaptcha } from '@common/basic/components/Captcha.tsx';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';
import { updateAdminUserInfo } from '@common/basic/utils/adminUser.ts';

type loginData = {
  username: string;
  password: string;
  captcha: string;
};

type loginResult = {
  nickname: string;
  token: string;
}

export const AdminLoginForm = ({ onLoginSuccess, title = '登录' }: { title?: string, onLoginSuccess: () => void }) => {
  const {
    setAdminUserInfo,
    setAdminPermissionList,
    setAdminMenuList,
  } = useAdminUserStorage();
  const captchaInput = useRef<HTMLInputElement>();
  const [logging, setLogging] = useState(false);
  const handleSubmit = async (values: loginData) => {
    setLogging(true);
    try {
      await handleLoginFormSubmit(values);
      await updateAdminUserInfo({
        setAdminUserInfo,
        setAdminPermissionList,
        setAdminMenuList,
      });
      setTimeout(onLoginSuccess);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      refreshCaptcha('login');
      log.error('AdminLoginForm -> login failed:', e);
      notification.error({
        message: '登录失败',
        description: e.msg || e.statusText || JSON.stringify(e),
        key: 'login',
      });
    }
    setLogging(false);
  };
  return <ProCard
    title={title}
    layout={'center'}
    type={'inner'}
  >
    <ProForm<loginData>
      onFinish={handleSubmit}
      labelCol={{ style: { width: '80px' } }}
      layout={'horizontal'}
      style={{ width: 'min(100%, 360px)' }}
      loading={logging}
      submitter={{
        render: () => {
          return <Button loading={logging} block type={'primary'} htmlType={'submit'}>登录</Button>;
        },
      }}
    >
      <ProFormText name={'username'} label={'用户名'} placeholder={'请输入用户名'} rules={getFormRules('username')}/>
      <ProFormText.Password
        name={'password'}
        label={<span>密&emsp;码</span>}
        placeholder={'请输入密码'}
        rules={getFormRules('password')}
      />
      <ProFormText
        fieldProps={{
          ref: captchaInput as never,
          maxLength: 4,
        }}
        name={'captcha'}
        label={'验证码'}
        placeholder={'请输入验证码'}
        rules={getFormRules('captcha')}
        addonWarpStyle={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start' }}
        addonAfter={<Space>
          <Captcha
            imgProps={{ style: { height: '40px', width: '120px' } }}
            captchaType={'login'}
            onClick={() => {
              captchaInput.current?.focus();
              captchaInput.current?.select();
            }}
          />
        </Space>}
      />
    </ProForm>
  </ProCard>;
};

const loginFormFieldLabels = {
  username: '用户名',
  password: '密码',
  captcha: '验证码',
};
const getFormRules = (field: 'username' | 'password' | 'captcha') => {
  const rules: Rule[] = [];
  rules.push({
    required: true,
    message: `请输入${loginFormFieldLabels[field]}`,
  });

  if (field == 'captcha') {
    rules.push({
      min: 4,
      max: 4,
      validateTrigger: ['onblur'],
      message: '请输入4位验证码',
    });
  }

  return rules;
};

const handleLoginFormSubmit = async (values: loginData) => {
  const loginResult = await axios.post<loginResult>('/app/admin/account/login', values);
  log.debug('login res:', loginResult);
};
