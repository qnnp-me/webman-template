declare type AdminUserInfoType = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string | null;
  mobile: string | null;
  isSuperAdmin: boolean;
  token: string;
}
declare type AdminMenuItemType = {
  id: number;
  value: number;
  // 父级id
  pid: number;
  // 标识
  key: string;
  // 图标
  icon: string;
  name: string;
  title: string;
  // 链接
  href: string;
  // 0: 目录 1: 菜单 2: 权限
  type: 0 | 1 | 2;
  // 排序越大排越前
  weight: number;
  created_at: string;
  updated_at: string;
  children?: AdminMenuItemType[];
}
