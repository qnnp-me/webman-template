import log from 'loglevel';
import { ComponentType, lazy, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';

import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';

import '@common/basic/assets/styles/main.scss';
import Page404 from '@common/basic/components/404.tsx';
import PageLoading from '@common/basic/components/PageLoading.tsx';
import { ComponentPreviews, useInitial } from '@common/dev';
import { DevSupport } from '@react-buddy/ide-toolbox';

const pages = import.meta.glob([
  '@admin/**/*.tsx',
  '@home/**/*.tsx',
  '!/**/_*/**/*.tsx',
]);
const routes: RouteObject[] = [];
for (const filePath in pages) {
  const dir = filePath.split('/').slice(0, -1).join('/');
  const file = filePath.split('/').slice(-1)[0];
  if (/\/_/g.test(dir) || /^_/.test(file)) {
    continue;
  }
  let path = dir.replace(/^\/home\/pages/, '/');
  path = path.replace(/^\/admin\/pages/, '/admin').replace(/(\[[^\]]+)_(])/g, '$1?$2').replace(/\[([^\]]+)]/g, ':$1');
  const Component = lazy(pages[filePath] as () => Promise<{ default: ComponentType }>);
  let parent: RouteObject[];
  const route = {} as RouteObject;
  if (file === 'index.tsx') {
    parent = routes.find(route => dir.startsWith(route.path!))?.children || routes;
    route.index = true;
    route.path = path;
  } else if (file === '[...].tsx') {
    parent = routes.find(route => dir.startsWith(route.path!))?.children || routes;
    route.index = true;
    route.path = `${path}/*`;
  } else if (file === '[layout].tsx') {
    parent = routes.find(route => dir.startsWith(route.path!))?.children || routes;
    route.path = path;
    route.children = [];
  } else if (/^\[([^\]]+)]\.tsx$/.test(file)) {
    parent = routes.find(route => dir.startsWith(route.path!))?.children || routes;
    const slug = file.match(/^\[([^\]]+)]\.tsx$/)![1];
    route.path = `${path}/:${slug}`;
  } else {
    parent = routes.find(route => dir.startsWith(route.path!))?.children || routes;
    route.path = `${path}/${file.replace(/\.tsx$/, '')}`;
  }
  route.loader = pages[filePath];
  route.element = <Suspense fallback={<PageLoading loading={true}/>}>
    <Component/>
  </Suspense>;
  parent.push(route);
}
routes.push({
  path: '*',
  element: <Page404/>,
});
import.meta.env.DEV && log.debug(routes);
const browserRoutes = createBrowserRouter([
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

ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<RouterProvider router={browserRoutes}/>);
