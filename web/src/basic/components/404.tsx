import log from 'loglevel';
import { useEffect } from 'react';

import { Space } from 'antd';
import Button from 'antd/es/button';
import Result from 'antd/es/result';
import { useNavigate } from 'react-router-dom';

import utils from '@common/basic/utils/utils.ts';

export default function Page404({ home }: { home?: string }) {
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
        <Button type={'primary'} onClick={() => nav(home, { replace: true })}>返回首页</Button>
        {home === '/admin' && import.meta.env.DEV &&
          <Button>创建此菜单</Button>
        }
      </Space>}
    />
  </div>;
}
