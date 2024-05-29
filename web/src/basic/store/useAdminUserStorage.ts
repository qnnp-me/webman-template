import axios from 'axios';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { checkPermission } from '@common/basic/utils/checker.ts';
import zustandUtils from '@common/basic/utils/zustandUtils.ts';

type AdminUserStorageDataType = {
  adminPermissionList: AdminPermission[];
  adminMenuList: AdminMenuItemType[];
  adminUserInfo: AdminUserInfoType;
  isSuperAdmin: boolean;
  isLogin: boolean;
}
export type AdminUserStorageActionType = {
  setAdminPermissionList: (permissionList: AdminPermission[]) => void;
  setAdminMenuList: (menuList: AdminMenuItemType[]) => void;
  setAdminUserInfo: (userInfo: AdminUserInfoType) => void;
  clearAdminUserState: () => void;
  hasAdminPermission: (permissions: AdminPermission | AdminPermission[]) => boolean;
}
type AdminUserStorageType = AdminUserStorageDataType & AdminUserStorageActionType;

const useAdminUserStorage = create(persist<AdminUserStorageType>(
    (setState, getState) => {

      const initialAdminUserState: AdminUserStorageDataType = {
        adminPermissionList: [] as AdminPermission[],
        adminMenuList: [] as AdminMenuItemType[],
        adminUserInfo: {} as AdminUserInfoType,
        isSuperAdmin: false,
        isLogin: false,
      };

      const setAdminPermissionList = (permissionList: AdminPermission[]) => {
        setState({
          isSuperAdmin: permissionList.includes('*'),
          adminPermissionList: permissionList,
        });
      };

      const setAdminMenuList = (menuList: AdminMenuItemType[]) => setState({ adminMenuList: menuList });

      const setAdminUserInfo = (userInfo: AdminUserInfoType) => {
        const isLogin = !!userInfo.id;
        setState({ adminUserInfo: userInfo, isLogin });
        window.Admin = window.Admin || {};
        window.Admin.Account = userInfo;
      };

      const clearAdminUserState = () => {
        setState(initialAdminUserState);
        axios.get(`/app/admin/account/logout?fresh=${Date.now()}`);
      };

      const hasAdminPermission = (permissions: AdminPermission | AdminPermission[]) =>
        checkPermission(permissions, getState().adminPermissionList);

      return {
        adminPermissionList: [] as AdminPermission[],
        adminMenuList: [] as AdminMenuItemType[],
        adminUserInfo: {} as AdminUserInfoType,
        isSuperAdmin: false,
        isLogin: false,
        setAdminPermissionList,
        setAdminMenuList,
        setAdminUserInfo,
        hasAdminPermission,
        clearAdminUserState,
      };
    },
    {
      name: 'admin-user-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.adminUserInfo) {
          window.Admin = window.Admin || {};
          window.Admin.Account = state.adminUserInfo;
        }
      },
    },
  ),
);
export default useAdminUserStorage;

zustandUtils.withStorageDOMEvents(useAdminUserStorage as never);

