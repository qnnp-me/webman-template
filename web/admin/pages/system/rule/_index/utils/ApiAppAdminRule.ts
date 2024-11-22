import axios from 'axios';

import {arrayToTree} from '@basic/utils/utils.ts';

const prepareRuleTree = (list: AdminMenuItemType[]) =>
  arrayToTree<AdminMenuItemType>(list, {
    renderNode(node) {
      node._key = node.key;
      delete node.key;
      return node;
    },
  });
export const ApiGetAdminRuleList = async (limit = 10000, type: string | undefined = undefined) => (await axios.get<AdminMenuItemType[]>('/app/admin/rule/select', {
  params: {
    limit,
    type,
  },
})).data;
export const ApiGetAdminRuleTree = async () => prepareRuleTree(await ApiGetAdminRuleList(10000));
export const ApiGetAdminRuleMenuTree = async () => prepareRuleTree(await ApiGetAdminRuleList(10000, '0,1'));
export const ApiGetAdminRuleFolderTree = async () => prepareRuleTree(await ApiGetAdminRuleList(10000, '0'));
export const ApiUpdateAdminRule = async (data: Pick<AdminMenuItemType, 'id' | 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminMenuItemType>('/app/admin/rule/update', data)).data;
export const APiAddAdminRule = async (data: Pick<AdminMenuItemType, 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminMenuItemType>('/app/admin/rule/insert', data)).data;
export const ApiDeleteAdminRule = async (id: number | number[]) => (await axios.post<AdminMenuItemType>('/app/admin/rule/delete', {id})).data;
