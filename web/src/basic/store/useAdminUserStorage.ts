import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import defaultSysConfig from '@basic/assets/json/pear.config.json';
import {
  ApiGetAdminMenuList,
  ApiGetAdminPermissionList,
  ApiGetAdminUserInfo,
  ApiGetSystemConfig,
} from '@basic/utils/ApiAdminUser.ts';
import { ApiGetCommonSystemInfo } from '@basic/utils/ApiCommonSystem.ts';
import * as utils from '@basic/utils/utils.ts';

type AdminUserStorageDataType = {
  adminPermissionList: AdminPermission[];
  adminMenuList: AdminMenuItemType[];
  adminUserInfo: AdminUserInfoType;
  isSuperAdmin: boolean;
  isLogin: boolean;
  isAdminUserStorageReady: boolean;
  sysConfig: SysConfigType
}
export type AdminUserStorageActionType = {
  adminUserLogout: () => void;
  updateAdminUserInfo: () => Promise<void>;
  hasAdminPermission: (permissions: AdminPermission | AdminPermission[]) => boolean;
  setAdminUserInfoReady: () => void;
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
        isAdminUserStorageReady: false,
        sysConfig: defaultSysConfig as SysConfigType,
      };

      const adminUserLogout = () => {
        setState({
          ...initialAdminUserState,
          isAdminUserStorageReady: true,
        });
        void axios.get(`/app/admin/account/logout?fresh=${Date.now() as unknown as string}`);
      };

      const hasAdminPermission = (permissions: AdminPermission | AdminPermission[]) =>
        utils.checkPermission(permissions, getState().adminPermissionList);

      const updateAdminUserInfo = async () => {
        let sysConfig: SysConfigType;
        let adminPermissionList = [] as AdminPermission[];
        let adminMenuList = [] as AdminMenuItemType[];
        let adminUserInfo = {} as AdminUserInfoType;
        try {
          sysConfig = await ApiGetSystemConfig();
          adminPermissionList = await ApiGetAdminPermissionList();
          adminMenuList = await ApiGetAdminMenuList();
          adminUserInfo = await ApiGetAdminUserInfo();
        } catch (e) {
          const commonInfo = await ApiGetCommonSystemInfo();
          sysConfig = {
            logo: {
              title: commonInfo.title,
              image: commonInfo.logo,
              icp: commonInfo.icp,
              beian: commonInfo.beian,
              footer_txt: commonInfo.footer_txt,
            },
          } as SysConfigType;
        }
        setState({
          isLogin: !!adminUserInfo.id,
          sysConfig, adminPermissionList, adminMenuList, adminUserInfo,
          isSuperAdmin: adminPermissionList.includes('*'),
          isAdminUserStorageReady: true,
        });
        window.Admin = window.Admin || {} as unknown as typeof window.Admin;
        if (window.Admin) {
          window.Admin.Account = adminUserInfo;
        }
      };

      const setAdminUserInfoReady = () => {
        setState({ isAdminUserStorageReady: true });
      };

      return {
        ...initialAdminUserState,
        hasAdminPermission,
        adminUserLogout,
        updateAdminUserInfo,
        setAdminUserInfoReady,
      };
    },
    {
      name: 'admin-user-storage',
      onRehydrateStorage: () => (state) => {
        void state?.updateAdminUserInfo()
          .then(() => {
            window.Admin = window.Admin || {} as unknown as typeof window.Admin;
            if (window.Admin) {
              window.Admin.Account = state.adminUserInfo;
            }
          })
          .catch(() => {
          })
          .then(() => {
            state.setAdminUserInfoReady();
          });
      },
    },
  ),
);
export default useAdminUserStorage;

utils.withStorageDOMEvents(useAdminUserStorage as never);

