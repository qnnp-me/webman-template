import { useEffect, useState } from 'react';

import Input from 'antd/es/input/Input';
import Popover from 'antd/es/popover';

import * as Icons from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import styles from '@common/basic/components/Icon/assets/styles/styles.module.scss';
import { Icon } from '@common/basic/components/Icon/Icon.tsx';
import { layuiIcons } from '@common/basic/components/layuiIcons.ts';
import { AntdIconType } from '@common/basic/types/antd';

const IconKeys: AntdIconType[] =
  Object.keys(Icons).filter(name => /^[A-Z]/.test(name)) as never;
const options: {
  label: React.ReactNode;
  value: AntdIconType | LayuiIconType;
}[] = IconKeys.map(label => {
  // eslint-disable-next-line import/namespace
  const Icon = Icons[label];
  return ({
    label: <Icon/>,
    value: label,
  });
});
options.push(...layuiIcons.map(label => ({
  label: <Icon icon={label as LayuiIconType}/>,
  value: label,
})) as typeof options);
const optionsGrouped: Partial<Record<string, (typeof options)>> = {};
for (const option of options) {
  if (/Outlined$/.test(option.value)) {
    optionsGrouped['Outlined'] = optionsGrouped['Outlined'] || [];
    optionsGrouped['Outlined'].push(option);
  }
  if (/Filled$/.test(option.value)) {
    optionsGrouped['Filled'] = optionsGrouped['Filled'] || [];
    optionsGrouped['Filled'].push(option);
  }
  if (/TwoTone$/.test(option.value)) {
    optionsGrouped['TwoTone'] = optionsGrouped['TwoTone'] || [];
    optionsGrouped['TwoTone'].push(option);
  }
  if (/^layui-icon/.test(option.value)) {
    optionsGrouped['layui-icon'] = optionsGrouped['layui-icon'] || [];
    optionsGrouped['layui-icon'].push(option);
  }
}

export const IconSelector = ({ value, onChange }: {
  value?: AntdIconType | LayuiIconType,
  onChange?: (value: AntdIconType | LayuiIconType) => void
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectorOpen, setSelectorOpen] = useState(false);
  useEffect(() => {
    if (!selectorOpen) {
      setSearch('');
      setPage(1);
    }
  }, [selectorOpen]);
  useEffect(() => {
    setPage(1);
  }, [search]);
  return <Popover
    destroyTooltipOnHide
    trigger={'click'}
    onOpenChange={setSelectorOpen}
    open={selectorOpen}
    content={
      <ProCard
        title={'图标选择'}
        size={'small'}
        extra={<Input
          value={search}
          allowClear
          size={'small'}
          placeholder={'搜索图标'}
          onInput={(e) => {
            setSearch((e.target as HTMLInputElement).value.replace(/[^a-zA-Z0-9]/g, ''));
          }}
          onKeyDown={e => {
            if (e.key == 'Escape') {
              setSearch('');
            }
          }}
        />}
        tabs={{
          onChange() {
            setPage(1);
          },
          destroyInactiveTabPane: true,
          items: Object.keys(optionsGrouped).sort((a) => a == 'Outlined' ? -1 : 0).map(group => {
            const list = optionsGrouped[group]?.filter(item => item.value.toLowerCase().includes(search.toLowerCase()));
            const pageSize = 36;
            const total = list?.length || 0;
            const currentPageList = list?.slice((page - 1) * pageSize, page * pageSize);
            return {
              label: ({
                Filled: '实底风格',
                Outlined: '线框风格',
                TwoTone: '双色风格',
                'layui-icon': 'Layui',
              })[group],
              key: group,
              children: <div
                className={styles.icon_select_dropdown}
              >
                {currentPageList?.map(option => {
                  return <div
                    className={styles.icon_option}
                    key={option.value as string} onClick={() => {
                    onChange?.(option.value);
                    setSelectorOpen(false);
                  }}
                    title={option.value}
                  >{option.label}</div>;
                })}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    fontSize: '18px',
                    color: '#aaa',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'end',
                    width: '100%',
                    userSelect: 'none',
                  }}
                >
                  <Icon
                    onClick={() => {
                      page > 1 && setPage(page - 1);
                    }} icon={'LeftSquareFilled'}
                  />
                  <span>{page}/{Math.ceil(total / pageSize) as unknown as string}</span>
                  <Icon
                    onClick={() => {
                      page < Math.ceil(total / pageSize) && setPage(page + 1);
                    }}
                    icon={'RightSquareFilled'}
                  />
                </div>
              </div>,
            };
          }),
        }}
      />
    }
  >
      <span
        className={styles.icon_select_label} onClick={() => {
        setSelectorOpen(!selectorOpen);
      }}
      >
        {value ? <Icon icon={value}/> :
          <span style={{ fontSize: '14px', color: '#aaa' }}><Icon icon={'SelectOutlined'}/> 请选择图标</span>}
        <span style={{ fontSize: '12px', color: '#aaa' }}>
        <Icon icon={selectorOpen ? 'CaretUpOutlined' : 'CaretDownOutlined'}/>
        </span>
      </span>
  </Popover>;
};
