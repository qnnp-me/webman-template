
import { ReloadOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/es/components/AntdIcon';
import { SpaceProps } from 'antd/lib';
import Space from 'antd/lib/space';
import Spin from 'antd/lib/spin';
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react';

import * as utils from '@basic/utils/utils.ts';

export const Captcha = (props: {
  withFresh?: boolean
  size?: 'small' | 'middle' | 'large'
  // PHP 端使用 session()->get("captcha-$type") 读取验证码, 不区分大小写
  captchaType: string
  imgProps?: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  iconProps?: React.ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>>
  containerProps?: SpaceProps
  onLoad?: () => void
  onClick?: () => void
}) => {
  const { captchaType = 'login', withFresh = true, onLoad, onClick } = props;
  const [loading, setLoading] = useState(false);
  const getCaptchaUrl = () => {
    return utils.getCaptchaUrl(captchaType, true);
  };
  const [url, setUrl] = useState(getCaptchaUrl());
  useEffect(() => {
    loading && setTimeout(() => { setUrl(getCaptchaUrl()); }, 50);
    loading && onClick?.();
  }, [loading]);
  useEffect(() => {
    helper[captchaType] = () => {
      setUrl(getCaptchaUrl());
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete helper[captchaType];
    };
  }, []);
  return (
    <Space {...props.containerProps} >
      <Spin spinning={loading}>
        <img
          onClick={() => { setLoading(true); }}
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
      {withFresh && <div
        style={{
          cursor: 'pointer',
        }}
      >
        <ReloadOutlined
          style={{ fontSize: '18px' }}
          {...props.iconProps}
          spin={loading}
          onClick={() => { setLoading(true); }}
        />
      </div>}
    </Space>
  );
};
const helper: Record<string, CallableFunction | undefined> = {};
// eslint-disable-next-line react-refresh/only-export-components
export const refreshCaptcha = (type: string) => {
  helper[type]?.();
};
