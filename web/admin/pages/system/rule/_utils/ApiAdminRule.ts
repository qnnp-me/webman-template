import axios from 'axios';

export type AdminRuleItemType = {
  name: string
  value: string
  id: number
  pid: number | null
  children?: AdminRuleItemType[]
}
export const ApiGetAdminRuleTree = async (type = '0,1') => (await axios.get<AdminRuleItemType[]>(`/app/admin/rule/select?format=tree&type=${type}`)).data;
export const ApiGetAdminRuleList = async (limit = 10000) => (await axios.get<AdminRuleItemType[]>(`/app/admin/rule/select?limit=${limit}`)).data;
export const ApiUpdateAdminRule = async (data: Pick<AdminMenuItemType, 'id' | 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminRuleItemType>('/app/admin/rule/update', data)).data;
export const APiAddAdminRule = async (data: Pick<AdminMenuItemType, 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminRuleItemType>('/app/admin/rule/insert', data)).data;
export const ApiDeleteAdminRule = async (id: number | number[]) => (await axios.post<AdminRuleItemType>('/app/admin/rule/delete', { id })).data;
