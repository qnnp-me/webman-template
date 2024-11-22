import * as Icons from '@ant-design/icons';
import { ProColumns, ProFormColumnsType } from '@ant-design/pro-components';

declare type ProColumnsType<T> = (ProColumns<T> & { dataIndex?: keyof T })[]
declare type AntdIconType = keyof Omit<typeof Icons,
  'default' | 'setTwoToneColor' | 'createFromIconfontCN' | 'getTwoToneColor' | 'IconProvider'>;
declare type BetaSchemaColumnType<T> = ProFormColumnsType<T> & {
  dataIndex?: keyof T,
  name?: keyof T
};
declare type BetaSchemaColumnsType<T> = BetaSchemaColumnType<T>[]

