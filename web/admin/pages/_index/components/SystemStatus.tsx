import { useEffect, useState } from 'react';

import Button from 'antd/es/button';
import Space from 'antd/lib/space';

import { ApiGetManageDashboardStatus } from '@admin/pages/_index/utils/ApiManageDashboard.ts';
import { ProCard } from '@ant-design/pro-components';
import { Icon } from '@common/basic/components/Icon/Icon.tsx';

export const SystemStatus = () => {
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [doUpdate, _update] = useState(0);
  const update = () => _update(Date.now());
  const getStatus = (loading = true) => {
    loading && setLoading(true);
    ApiGetManageDashboardStatus()
      .then(res => {
        setStatus(res);
        setLoading(false);
      })
      .catch(err => {
        setStatus(err.msg);
        setLoading(false);
      });
  };
  useEffect(() => {
    getStatus(!doUpdate);
    const timer = setTimeout(update, 5000);
    return () => clearTimeout(timer);
  }, [doUpdate]);
  return <ProCard
    loading={loading} bodyStyle={{ overflow: 'auto' }} title={'系统状态'} extra={<Space>
    <Button icon={<Icon icon={'ReloadOutlined'}/>} onClick={()=>getStatus()}></Button>
  </Space>}
  >
    <pre>
    {status}
    </pre>
  </ProCard>;
};
