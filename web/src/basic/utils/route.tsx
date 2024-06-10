import { ComponentType, lazy, Suspense } from 'react';

import { createBrowserRouter, Outlet, RouteObject } from 'react-router-dom';

import { BasicConfig } from '../../../basic.config.ts';

import { Page404 } from '@common/basic/components/Page404.tsx';
import { PageLoading } from '@common/basic/components/PageLoading.tsx';
import { ComponentPreviews, useInitial } from '@common/dev';
import { DevSupport } from '@react-buddy/ide-toolbox';

export const getRoutes = () => {
  const pages = import.meta.glob([
    '@admin/**/*.tsx',
    '@home/**/*.tsx',
    '!/**/_*/**/*.tsx',
  ]);
  const adminFolder = BasicConfig.adminFolder;
  const routes: RouteObject[] = [];
  for (const filePath in pages) {
    const dir = filePath.split('/').slice(0, -1).join('/');
    const file = filePath.split('/').slice(-1)[0];
    if (/\/_/g.test(dir) || /^_/.test(file)) {
      continue;
    }
    let path = dir.replace(/^\/home\/pages/, '/');
    path = path.replace(new RegExp(`^/${adminFolder}/pages`), `/${adminFolder}`).replace(/(\[[^\]]+)_(])/g, '$1?$2').replace(/\[([^\]]+)]/g, ':$1');
    const Component = lazy(pages[filePath] as () => Promise<{ default: ComponentType }>);
    const route = {} as RouteObject;
    if (file === 'index.tsx') {
      route.index = true;
      route.path = path;
    } else if (file === '[...].tsx') {
      route.index = true;
      route.path = `${path}/*`;
    } else if (file === '[layout].tsx') {
      route.path = path;
      route.children = [
        {
          path: '*',
          element: <Page404/>,
        },
      ];
    } else if (/^\[([^\]]+)]\.tsx$/.test(file)) {
      const slug = file.match(/^\[([^\]]+)]\.tsx$/)![1];
      route.path = `${path}/:${slug}`;
    } else {
      route.path = `${path}/${file.replace(/\.tsx$/, '')}`;
    }
    route.loader = pages[filePath];
    route.element = <Suspense fallback={<PageLoading loading={true}/>}>
      <Component/>
    </Suspense>;
    (routes.find(route => dir.startsWith(route.path!))?.children || routes)
      .push(route);
  }
  routes.push({
    path: '*',
    element: <Page404/>,
  });
  return createBrowserRouter([
    {
      element: <DevSupport
        ComponentPreviews={ComponentPreviews}
        useInitialHook={useInitial}
      >
        <Outlet/>
      </DevSupport>,
      children: routes,
    },
  ]);
};
