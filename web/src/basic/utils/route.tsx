import {ComponentType, lazy, Suspense} from 'react';
import {createBrowserRouter, Outlet, RouteObject} from 'react-router-dom';

import {Page404} from '@basic/components/Page404.tsx';
import {PageLoading} from '@basic/components/PageLoading.tsx';

export const getRoutes = (
  pages: Record<string, () => Promise<unknown>>,
  prefix = '',
) => {
  const routes: RouteObject[] = [];
  for (const filePath in pages) {
    const dir = filePath.split('/').slice(0, -1).join('/');
    const file = filePath.split('/').slice(-1)[0];
    if (/\/_/g.test(dir) || /^_/.test(file)) {
      continue;
    }
    const path = dir.replace(
      new RegExp('^/[^/]+/pages'),
      `/${prefix}`,
    ).replace(
      /(\[[^\]]+)_(])/g,
      '$1?$2',
    ).replace(
      /\[([^\]]+)]/g,
      ':$1',
    );
    const Component = lazy(pages[filePath] as () => Promise<{ default: ComponentType }>);
    const route = {} as RouteObject;
    route.loader = pages[filePath];
    route.element = <Suspense fallback={<PageLoading loading={true}/>}>
      <Component/>
    </Suspense>;
    if (file === 'index.tsx') {
      route.index = true;
      route.path = path;
    } else if (file === '[...].tsx') {
      route.path = path;
      route.children = [
        {
          path: '*',
          loader: pages[filePath],
          element: <Suspense fallback={<PageLoading loading={true}/>}>
            <Component/>
          </Suspense>,
        },
      ];
      route.loader = undefined;
      route.element = undefined;
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
    (routes.find(route => dir.startsWith(route.path!))?.children || routes)
      .push(route);
  }
  routes.push({
    path: '*',
    element: <Page404/>,
  });
  console.log(routes);
  return createBrowserRouter([
    {
      element: <Outlet/>,
      children: routes,
    },
  ], {
    future: {
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true,
      ...{
        v7_startTransition: true,
      },
    },
  });
};
