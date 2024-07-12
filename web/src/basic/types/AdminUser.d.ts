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
  pid?: number;
  // 标识
  key?: string;
  // 前端处理转换的 key, 避免 key 影响到前端代码
  _key?: string;
  // 图标
  icon?: string;
  name: string;
  title: string;
  // 链接
  href?: string;
  // 0: 目录 1: 菜单 2: 权限
  type: 0 | 1 | 2;
  // 排序越大排越前
  weight: number;
  created_at: string;
  updated_at: string;
  children?: AdminMenuItemType[];
}
declare type SysConfigType = {
  logo: {
    title: string;
    image: string;
    icp: string;
    beian: string;
    footer_txt: string;
  };
  menu: {
    data: string;
    method: string;
    accordion: boolean;
    collapse: boolean;
    control: boolean;
    controlWidth: number;
    select: string;
    async: boolean;
  };
  tab: {
    enable: boolean;
    keepState: boolean;
    preload: boolean;
    session: boolean;
    max: string;
    index: {
      id: string;
      href: string;
      title: string;
    };
  };
  theme: {
    defaultColor: string;
    defaultMenu: string;
    defaultHeader: string;
    allowCustom: boolean;
    banner: boolean;
  };
  colors: {
    id: string;
    color: string;
    second: string;
  }[];
  other: {
    keepLoad: string;
    autoHead: boolean;
    footer: boolean;
  };
  header: {
    message: boolean;
  };
};
