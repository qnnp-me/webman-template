import Button from 'antd/es/button';
import Result from 'antd/es/result';
import { useNavigate } from 'react-router-dom';

export default function Page({ home = '/' }) {
  const nav = useNavigate();
  return <div>
    <Result
      status={'404'}
      title={'您访问的页面不存在'}
      subTitle={'请检查您的网络或者联系管理员'}
      extra={<Button type={'primary'} onClick={() => nav(home, { replace: true })}>返回首页</Button>}
    />
  </div>;
}
