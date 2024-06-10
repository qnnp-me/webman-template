import { AdminMySettingTabBasic } from '@admin/pages/my/setting/_index/components/AdminMySettingTabBasic.tsx';
import { ProCard } from '@ant-design/pro-components';

export default function PageAdminMySetting() {
  return <ProCard
    tabs={{
      items: [
        {
          label: '个人信息',
          key: 'basic',
          children: <AdminMySettingTabBasic/>,
        },
      ],
    }}
  />;
}
