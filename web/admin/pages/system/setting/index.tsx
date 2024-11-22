import { ProCard } from '@ant-design/pro-components';

import { AdminSystemSettingTabBasic } from '#admin/pages/system/setting/_index/components/AdminSystemSettingTabBasic.tsx';

export default function PageAdminSystemSetting() {
  return <ProCard
    tabs={{
      items: [
        {
          label: '基础设置',
          key: 'basic',
          children: <AdminSystemSettingTabBasic/>,
        },
      ],
    }}
  />;
}
