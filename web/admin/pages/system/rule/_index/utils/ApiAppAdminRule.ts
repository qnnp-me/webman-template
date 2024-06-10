import axios from 'axios';

import { arrayToTree } from '@common/basic/utils/utils.ts';

const prepareRuleTree = (list: AdminMenuItemType[], withWebmanAdmin = false) => {
  let tree = arrayToTree<AdminMenuItemType>(list, {
    renderNode(node) {
      node._key = node.key;
      delete node.key;
      return node;
    },
  });
  if (!withWebmanAdmin) {
    tree = tree.filter(node => {
      return !((node.children?.[0]?._key as unknown as string)?.startsWith('plugin\\admin')
        || /^(demos?([0-9]*|-(system|common|error))|auth|database|user|common|plugin|dev)$/.test((node.children?.[0]?._key as unknown as string) || ''));
    });
  }
  return tree;
};
export const ApiGetAdminRuleList = async (limit = 10000, type: string | undefined = undefined) => (await axios.get<AdminMenuItemType[]>('/app/admin/rule/select', {
  params: {
    limit,
    type,
  },
})).data;
export const ApiGetAdminRuleTree = async (withWebmanAdmin = false) => prepareRuleTree(await ApiGetAdminRuleList(10000), withWebmanAdmin);
export const ApiGetAdminRuleMenuTree = async (withWebmanAdmin = false) => prepareRuleTree(await ApiGetAdminRuleList(10000, '0,1'), withWebmanAdmin);
export const ApiGetAdminRuleFolderTree = async (withWebmanAdmin = false) => prepareRuleTree(await ApiGetAdminRuleList(10000, '0'), withWebmanAdmin);
export const ApiUpdateAdminRule = async (data: Pick<AdminMenuItemType, 'id' | 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminMenuItemType>('/app/admin/rule/update', data)).data;
export const APiAddAdminRule = async (data: Pick<AdminMenuItemType, 'pid' | 'title' | 'key' | 'href' | 'icon' | 'weight' | 'type'>) => (await axios.post<AdminMenuItemType>('/app/admin/rule/insert', data)).data;
export const ApiDeleteAdminRule = async (id: number | number[]) => (await axios.post<AdminMenuItemType>('/app/admin/rule/delete', { id })).data;
