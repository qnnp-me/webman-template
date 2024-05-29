import axios from 'axios';

import { AdminUserStorageActionType } from '@common/basic/store/useAdminUserStorage.ts';

export const getAdminUserInfo = async () => (await axios.get<AdminUserInfoType>(`/app/admin/account/info?fresh=${Date.now()}`)).data;
export const getAdminMenuList = async () => (await axios.get<AdminMenuItemType[]>(`/app/admin/rule/get?fresh=${Date.now()}`)).data;
export const getAdminPermissionList = async () => (await axios.get<AdminPermission[]>(`/app/admin/rule/permission?fresh=${Date.now()}`)).data;
export const updateAdminUserInfo = async (
  {
    setAdminUserInfo,
    setAdminPermissionList,
    setAdminMenuList,
  }: Pick<AdminUserStorageActionType, 'setAdminUserInfo' | 'setAdminPermissionList' | 'setAdminMenuList'>) => {
  const adminPermissionList = await getAdminPermissionList();
  setAdminPermissionList(adminPermissionList);
  const adminMenuList = await getAdminMenuList();
  setAdminMenuList(adminMenuList);
  const adminInfo = await getAdminUserInfo();
  setAdminUserInfo(adminInfo);
};
