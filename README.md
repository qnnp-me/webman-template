# 创建项目

`sh -c "$(curl -fsSL https://qnnp.me/public/webman-template/create.php)"`

# web

## 路由

- https?://example.com/ -> /home/pages/index.tsx
- https?://example.com/* -> /home/pages/*
- https?://example.com/admin -> /admin/pages/index.tsx
- https?://example.com/admin/* -> /admin/pages/*

> https?://example.com/foo -> /home/pages/foo/index.tsx | /home/pages/foo.tsx\
> https?://example.com/foo/bar -> /home/pages/foo/bar/index.tsx | /home/pages/foo/bar.tsx\
> https?://example.com/bar/foo -> /home/pages/bar/[.].tsx\
> https?://example.com/xxx/foo -> /home/pages/bar/[.].tsx\

## 类型

### 权限类型

> /web/src/types/basic/admin/permission.d.ts\
> 此文件为权限类型文件，文件内容由 /server 启动时自动根据数据权限规则表生成, 不需要手动维护, 故 /web 文件夹不要轻易改名.\
> 如需要修改 /web 文件夹名请同步修改 /server/support/init/ForWeb.php 文件的 $web_folder 属性

## 菜单
> 设置菜单时如果填写的 url 为 https?:// 样式开头的即新窗口打开\
> 设置 /admin/iframe/* 开头的即使用 iframe 模式打开\
> 设置 /admin/iframe/(http?|file|....)//* 之类的即使用 iframe 模式打开相关链接