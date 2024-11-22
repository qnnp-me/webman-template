
import { Space } from 'antd';
import Button from 'antd/es/button';
import Result from 'antd/es/result';
import log from 'loglevel';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@basic/components/Icon/Icon.tsx';
import * as utils from '@basic/utils/utils.ts';

export const Page404 = ({ home }: { home?: string }) => {
  home = home || (location.pathname.startsWith('/admin') ? '/admin' : '/');
  const nav = useNavigate();
  useEffect(() => {
    utils.setPageLoading(false);
    log.debug('404 home', home);
  }, []);
  return <div>
    <Result
      status={'404'}
      title={'您访问的页面不存在'}
      subTitle={'请检查您的网络或者联系管理员'}
      extra={<Space>
        <Button
          icon={<Icon icon={'CaretLeftFilled'}/>}
          onClick={() => history.back()}
        >返回上一页</Button>
        <Button
          icon={<Icon icon={'HomeOutlined'}/>}
          type={'primary'}
          onClick={() => nav(home, { replace: true })}
        >返回首页</Button>
      </Space>}
    />
  </div>;
};
