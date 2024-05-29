import log from 'loglevel';
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';

import { ConfigProvider } from 'antd';
import { SpaceProps } from 'antd/lib';
import Space from 'antd/lib/space';
import Spin from 'antd/lib/spin';

import { ReloadOutlined } from '@ant-design/icons';
import utils from '@common/basic/utils/utils.ts';

export const Captcha = (props: {
  withFresh?: boolean
  // PHP 端使用 session()->get("captcha-$type") 读取验证码, 不区分大小写
  captchaType: string
  imgProps?: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  containerProps?: SpaceProps
  onLoad?: () => void
  onClick?: () => void
}) => {
  const { componentSize } = ConfigProvider.useConfig();
  const { captchaType = 'login', withFresh = true, onLoad, onClick } = props;
  const [loading, setLoading] = useState(false);
  const getCaptchaUrl = () => {
    return utils.getCaptchaUrl(captchaType, true);
  };
  const [url, setUrl] = useState(getCaptchaUrl());
  useEffect(() => {
    loading && setTimeout(() => setUrl(getCaptchaUrl()), 50);
    loading && onClick?.();
  }, [loading]);
  useEffect(() => {
    helper[captchaType] = () => {
      setUrl(getCaptchaUrl());
    };
    log.debug('size', componentSize);
    return () => {
      delete helper[captchaType];
    };
  }, []);
  return (
    <Space {...props.containerProps} >
      <Spin spinning={loading}>
        <img
          onClick={() => setLoading(true)}
          {...props.imgProps}
          style={{
            display: 'block',
            cursor: 'pointer',
            ...props.imgProps?.style,
          }}
          src={url}
          onLoad={() => {
            setLoading(false);
            onLoad?.();
          }}
          alt="验证码"
        />
      </Spin>
      {withFresh && <ReloadOutlined
        spin={loading}
        style={{ fontSize: '20px', cursor: 'pointer' }}
        onClick={() => setLoading(true)}
      />}
    </Space>
  );
};
const helper: Record<string, CallableFunction | undefined> = {};
// eslint-disable-next-line react-refresh/only-export-components
export const refreshCaptcha = (type: string) => {
  helper[type]?.();
};
