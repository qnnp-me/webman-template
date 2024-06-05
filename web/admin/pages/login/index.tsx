import axios from 'axios';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';

import { App, Divider, Modal, notification } from 'antd';
import Alert from 'antd/es/alert/Alert';
import Space from 'antd/lib/space';
import { Rule } from 'rc-field-form/es/interface';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { Captcha, refreshCaptcha } from '@common/basic/components/Captcha.tsx';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';

type loginData = {
  username: string;
  password: string;
  captcha: string;
};

type loginResult = {
  nickname: string;
  token: string;
}

export default function PageAdminLogin() {
  const { modal } = App.useApp();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    if (search.get('replaceTo')) {
      navigate(search.get('replaceTo') as string, { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };
  const { adminUserInfo, adminUserLogout, sysConfig } = useAdminUserStorage();
  const [goBack, setGoBack] = useState(false);
  useEffect(() => {
    if (adminUserInfo.id) {
      const timer = setTimeout(() => modal.confirm({
        title: '您已登录，是否重新登录？',
        keyboard: false,
        maskClosable: false,
        centered: true,
        okText: '重新登录',
        cancelText: '返回',
        onOk: () => {
          adminUserLogout();
        },
        onCancel: () => {
          setGoBack(true);
        },
      }), 100);
      return () => {
        Modal.destroyAll();
        clearTimeout(timer);
      };
    }
  }, []);
  useEffect(() => {
    if (goBack) {
      history.back();
      const timer = setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [goBack]);
  const captchaInput = useRef<HTMLInputElement>();
  const { updateAdminUserInfo } = useAdminUserStorage();
  const [logging, setLogging] = useState(false);
  const [failedMessage, setFailedMessage] = useState('');
  const handleSubmit = async (values: loginData) => {
    setLogging(true);
    try {
      await handleLoginFormSubmit(values);
      await updateAdminUserInfo();
      handleLoginSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      refreshCaptcha('login');
      log.error('AdminLoginForm -> login failed:', e);
      notification.error({
        message: '登录失败',
        description: e.msg || e.statusText || JSON.stringify(e),
        key: 'login',
      });
      setFailedMessage(e.msg || e.statusText || '登录失败');
    }
    setLogging(false);
  };
  return <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
    }}
  >
    <LoginFormPage
      title={sysConfig.logo.title}
      logo={sysConfig.logo.image}
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      loading={logging}
      onFinish={handleSubmit}
      mainStyle={{
        opacity: 1,
      }}
      containerStyle={{}}
    >
      {failedMessage
        ? <Alert type={'error'} showIcon style={{ margin: '12px 0' }} message={failedMessage}/>
        : <Divider/>}
      <ProFormText name={'username'} placeholder={'请输入用户名'} rules={getFormRules('username')}/>
      <ProFormText.Password
        name={'password'}
        placeholder={'请输入密码'}
        rules={getFormRules('password')}
      />
      <ProFormText
        fieldProps={{
          ref: captchaInput as never,
          maxLength: 4,
        }}
        name={'captcha'}
        placeholder={'请输入验证码'}
        rules={getFormRules('captcha')}
        addonWarpStyle={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-start' }}
        addonAfter={<Space>
          <Captcha
            imgProps={{ style: { height: '32px', width: '96px' } }}
            captchaType={'login'}
            onClick={() => {
              captchaInput.current?.focus();
              captchaInput.current?.select();
            }}
          />
        </Space>}
      />
    </LoginFormPage>
  </div>;
}
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
