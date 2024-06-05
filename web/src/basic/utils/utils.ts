import log from 'loglevel';

import { StoreMutators } from 'zustand';

// 设置页面加载状态
export const setPageLoading = window.setPageLoading;

// 获取验证码 URL, PHP 端使用 session()->get("captcha-$type") 读取验证码, 不区分大小写
export const getCaptchaUrl = (type = 'login', withFresh = false) =>
  `/app/admin/account/captcha/${type}${withFresh ? `?fresh=${Date.now()}` : ''}`;

export const withStorageDOMEvents = <T, S extends StoreMutators<T, T>['zustand/persist'] = StoreMutators<T, T>['zustand/persist']>(store: S) => {
  log.debug('withStorageDOMEvents:', store.persist.getOptions().name);
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };
  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};

// 权限检查
export const checkPermission = <T = string>(permissions: T | T[], permissionList: T[]) => {
  if (Array.isArray(permissions)) {
    if (permissionList.includes('*' as T)) {
      return true;
    }
    return permissionList.every((item) => permissions.includes(item));
  }
  return permissionList.includes(permissions);
};
type TreeNode<T, K extends string | number | symbol = keyof T | 'children'> =
  T & {
  [key in K]: TreeNode<T>[]
} & {
  parent?: T
}

export const arrayToTree = <T = unknown, R = TreeNode<T>>(
  items: T[],
  pid = 0,
  idKey = 'id' as keyof R,
  pidKey = 'pid' as keyof R,
  childKey = 'children' as keyof R,
): R[] => {
  const result: R[] = [];
  for (const item of items) {
    const _pid = item[pidKey as unknown as keyof T] || 0;
    if (_pid === pid) {
      const children = arrayToTree(items, item[idKey as unknown as keyof T] as number, idKey, pidKey, childKey);
      if (children.length) {
        (item as unknown as R)[childKey as keyof R] = children as R[keyof R];
      }
      result.push(item as unknown as R);
    }
  }
  return result;
};
