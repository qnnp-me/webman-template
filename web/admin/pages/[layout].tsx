import { useEffect, useState } from 'react';

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from '@admin/pages/assets/styles/[layout].module.scss';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import useAdminUserStorage from '@common/basic/store/useAdminUserStorage.ts';

const LayoutAdminMain = ({ loading }: { loading?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, isSuperAdmin, adminMenuList } = useAdminUserStorage();
  const [splitMenus] = useState<boolean>(true);
  useEffect(handleRootTagClassChange, []);
  useEffect(() => {
    if (!isLogin && location.pathname !== '/admin/login') {
      navigate(`/admin/login?replaceTo=${location.pathname}`, { replace: true });
      return;
    }
  }, [isLogin, location.pathname]);
  return <ProLayout
    className={styles.layout}
    token={{
      pageContainer: {
        paddingInlinePageContainerContent: 40,
      },
    }}
    onMenuHeaderClick={() => {
      navigate('/admin');
    }}
    contentStyle={{
      height: 'calc(100vh - 56px)',
      overflow: 'auto',
    }}
    layout={'mix'}
    splitMenus={splitMenus}
    menuItemRender={(item, dom) => {
      return (
        <Link
          to={item.path as string}
          target={item.path?.startsWith('http') ? '_blank' : undefined}
        >
          {dom}
        </Link>
      );
    }}
    menuDataRender={() => {
      const rawMenus = adminMenuList.map(menu => ({ ...menu, path: menu.href }));
      const menus: AdminMenuItemType[] = [];
      const webmanAdminMenu = [];
      for (const rawMenu of rawMenus) {
        const firstAvailableMenu = getFirstAvailableMenu([rawMenu] as never);
        if (firstAvailableMenu?.href?.startsWith('/app/admin/')) {
          webmanAdminMenu.push(rawMenu);
        } else {
          menus.push(rawMenu);
        }
      }
      if (isSuperAdmin) {
        menus.push({
          name: 'WebmanAdmin',
          href: '/admin/iframe/app/admin/index/dashboard',
          children: webmanAdminMenu,
        } as never);
      }
      return prepareMenuData(menus, splitMenus);
    }}
    loading={loading}
  >
    {((!isLogin && window.location.pathname.startsWith('/admin/login')) || isLogin) && <Outlet/>}
  </ProLayout>;
};
export default LayoutAdminMain;
const handleRootTagClassChange = () => {
  document.body.querySelector('body > #root')?.classList.add('_admin');
  return () => {
    document.body.querySelector('body > #root')?.classList.remove('_admin');
  };
};
const prepareMenuData = (data: AdminMenuItemType[], splitMenus = false) => {
  return data.map((item) => {
    const menu: MenuDataItem = {};
    menu.name = item.name;
    menu.path = item.href?.replace(/^\/app\//, '/admin/iframe/app/');
    menu.flatMenu = splitMenus ? !!menu.children?.length : !!item.href;
    if (item.children?.length) {
      menu.children = prepareMenuData(item.children || [], false);
    }
    if (!menu.path && splitMenus) {
      menu.path = getFirstAvailableMenu(menu.children || [])?.path;
    }
    return menu;
  });
};
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
