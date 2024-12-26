import { LogoutOutlined } from '@ant-design/icons';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import { App } from 'antd';
import Dropdown from 'antd/es/dropdown/dropdown';
import Space from 'antd/lib/space';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from './assets/styles/[layout].module.scss';
import { BasicConfig } from '../../src/basic.config.ts';
import { AntdIconType } from '../../src/types/antd';

import { Icon } from '@basic/components/Icon/Icon.tsx';
import useAdminUserStorage from '@basic/store/useAdminUserStorage.ts';

const LayoutAdminMain = ({ loading }: { loading?: boolean }) => {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    adminUserLogout,
    isLogin,
    isSuperAdmin,
    adminMenuList,
    adminUserInfo,
    sysConfig,
    isAdminUserStorageReady,
  } = useAdminUserStorage();
  const [splitMenus] = useState<boolean>(true);
  useEffect(handleRootTagClassChange, []);
  useEffect(() => {
    if (isAdminUserStorageReady && !isLogin && location.pathname != '/admin/login') {
      navigate(`/admin/login?replaceTo=${location.pathname}`, { replace: true });
      return;
    }
  }, [isLogin, location.pathname, isAdminUserStorageReady]);
  const [layoutMenus, setLayoutMenus] = useState<MenuDataItem[]>([]);
  useEffect(() => {
    const menus: AdminMenuItemType[] = [];
    // const webmanAdminMenu = [];
    for (const menuItem of adminMenuList) {
      menus.push(menuItem);
    }
    setLayoutMenus(prepareMenuData(menus, splitMenus));
  }, [isSuperAdmin, adminMenuList]);
  const [collapsed, setCollapsed] = useState(false);
  return <ProLayout
    onCollapse={setCollapsed}
    title={sysConfig.logo.title}
    logo={sysConfig.logo.image}
    className={styles.layout}
    token={{
      pageContainer: {
        paddingInlinePageContainerContent: 40,
      },
    }}
    onMenuHeaderClick={() => {
      isLogin && navigate('/admin');
    }}
    avatarProps={isLogin ? {
      src: adminUserInfo.avatar,
      title: adminUserInfo.nickname,
      render: (_props, dom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'setting',
                  icon: <Icon icon={'UserOutlined'}/>,
                  label: '个人设置',
                  onClick: () => {
                    navigate('/admin/my/setting');
                  },
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined/>,
                  label: '退出登录',
                  onClick: () =>
                    void modal.confirm({
                      title: '确认退出登录？',
                      onOk: () => {
                        adminUserLogout();
                      },
                    }),
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    } : {}}
    actionsRender={() => {
      return <div></div>;
    }}
    contentStyle={{
      height: 'calc(100vh - 56px)',
      overflow: 'auto',
    }}
    layout={'mix'}
    splitMenus={splitMenus}
    menuProps={{ className: `${styles.mainMenu} ${collapsed ? styles.mainMenuCollapsed : ''}` }}
    menuItemRender={(item) =>
      <Link
        onClick={e => {
          if (location.pathname == item.path?.split('?')[0]) {
            e.preventDefault();
          }
        }}
        to={item.path as string}
        target={item.path?.startsWith('http') ? '_blank' : undefined}
      >
        <Space className={styles.mainMenuItem}>
          {item.icon}
          {item.name}
        </Space>
      </Link>
    }
    subMenuItemRender={(props: MenuDataItem) =>
      <Space className={styles.mainMenuItem}>
        {props.icon}
        {props.name}
      </Space>
    }
    menuDataRender={() => layoutMenus}
    route={layoutMenus}
    loading={loading || (!isAdminUserStorageReady)}
    breadcrumbRender={breadcrumb => {
      return breadcrumb;
    }}
    bgLayoutImgList={[
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ]}
  >
    {isAdminUserStorageReady && (!isLogin && window.location.pathname.startsWith(`/${BasicConfig.adminFolder}/login`) || isLogin) &&
      <Outlet/>}
  </ProLayout>;
};
export default LayoutAdminMain;
const handleRootTagClassChange = () => {
  document.body.querySelector('body > #root')?.classList.add('_admin');
  return () => {
    document.body.querySelector('body > #root')?.classList.remove('_admin');
  };
};
const prepareMenuData = (data: AdminMenuItemType[], splitMenus = false) =>
  data.map((item) => {
    const menu: MenuDataItem = {};
    menu.name = item.name;
    menu.path = item.href?.replace(/^\/app\//, '/admin/iframe/app/');
    menu.flatMenu = splitMenus ? !!menu.children?.length : !!item.href;
    if (item.children?.length) {
      menu.children = prepareMenuData(item.children, false);
    }
    if (!menu.path && splitMenus) {
      const path = getFirstAvailableMenu(menu.children || [])?.path || '';
      menu.path = `${path}${path.match(/\?/g) ? '&_from=header' : '?_from=header'}`;
    }
    menu.icon = <Icon
      icon={item.icon as AntdIconType | LayuiIconType || 'MenuOutlined'}
      style={{ display: 'block' }}
    />;
    menu.key = menu.path;
    return menu;
  });
const getFirstAvailableMenu = (menus: MenuDataItem[]): MenuDataItem | null => {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    if (menu.href || menu.path) {
      return menu;
    }
    if (menu.children?.length) {
      const first = getFirstAvailableMenu(menu.children);
      if (first) {
        return first;
      }
    }
  }
  return null;
};
