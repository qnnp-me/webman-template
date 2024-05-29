import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PageContainer } from '@ant-design/pro-components';
import { AdminLoginForm } from '@common/basic/components/AdminUserRelated.tsx';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';

export default function PageAdminLogin() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    if (search.get('replaceTo')) {
      navigate(search.get('replaceTo') as string, { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };
  const { adminUserInfo, clearAdminUserState } = useAdminUserStorage();
  const [goBack, setGoBack] = useState(false);
  useEffect(() => {
    if (adminUserInfo.id) {
      const timer = setTimeout(() => Modal.confirm({
        title: '您已登录，是否重新登录？',
        keyboard: false,
        maskClosable: false,
        centered: true,
        okText: '重新登录',
        cancelText: '返回',
        onOk: () => {
          clearAdminUserState();
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
  return <PageContainer
    title={'管理员登录'}
    style={{
      height: 'calc(100vh - 56px)',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px - 72px)',
      }}
    >
      <div>
        <AdminLoginForm
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  </PageContainer>;
}
