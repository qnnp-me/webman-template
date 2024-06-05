import axios from 'axios';

export const ApiGetAdminUserInfo = async () => (await axios.get<AdminUserInfoType>(`/app/admin/account/info?fresh=${Date.now()}`)).data;
export const ApiGetAdminMenuList = async () => (await axios.get<AdminMenuItemType[]>(`/app/admin/rule/get?fresh=${Date.now()}`)).data;
export const ApiGetAdminPermissionList = async () => (await axios.get<AdminPermission[]>(`/app/admin/rule/permission?fresh=${Date.now()}`)).data;
export const ApiGetSystemConfig = async () => await axios.get('/app/admin/config/get') as never as SysConfigType;
