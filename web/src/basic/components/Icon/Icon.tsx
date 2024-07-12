import * as Icons from '@ant-design/icons';
import { IconProps } from '@ant-design/icons/es/components/IconBase';

import '@common/basic/components/Icon/assets/styles/layui-icon.css';
import { AntdIconType } from '@common/basic/types/antd';

export const Icon = <T extends (AntdIconType | LayuiIconType)>(
  {
    icon,
    onClick,
    ...props
  }: (T extends AntdIconType ? Partial<Omit<IconProps, 'icon'>> : Partial<HTMLBaseElement>) & {
    icon: T,
    onClick?: () => void
  }) => {
  icon = icon?.replace('layui-icon ', '') as T;
  if (icon?.startsWith('layui-icon')) {
    return <i
      {...props}
      className={`layui-icon ${icon}`}
      style={{ cursor: onClick ? 'pointer' : undefined, ...props.style } as never}
      onClick={onClick}
    />;
  }
  // eslint-disable-next-line import/namespace
  const Icon = Icons[icon as keyof typeof Icons] as unknown as React.JSX.ElementType | undefined;
  return <>
    {Icon ? <Icon
      {...props}
      style={{ cursor: onClick ? 'pointer' : undefined, ...props.style }}
      onClick={onClick}
    /> : null}
  </>;
};
