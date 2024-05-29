export const checkPermission = <T = string>(permissions: T | T[], permissionList: T[]) => {
  if (Array.isArray(permissions)) {
    if (permissionList.includes('*' as T)) {
      return true;
    }
    return permissionList.every((item) => permissions.includes(item));
  }
  return permissionList.includes(permissions);
};
