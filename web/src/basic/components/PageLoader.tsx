import log from 'loglevel';
import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import PageLoading from '@common/basic/components/PageLoading.tsx';
import utils from '@common/basic/utils/utils.ts';

const importPageComponent = async (path: string) => {
  try {
    return await import(`@/${path}.tsx`);
  } catch (e) {
    return null;
  }
};

const pathParamsPaths: string[] = [];
let prePath: string;
let currentPath: string;
let preLayout: string;
let currentLayout: string;

const PageLoader = () => {
  const location = useLocation();
  const [pathParams, setPathParams] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LayoutComponent, setLayoutComponent] = useState<any>(React.lazy(() => pending()));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [PageComponent, setPageComponent] = useState<any>(React.lazy(() => pending()));
  const loadPage = () => {
    setPathParams([]);
    setPageLoading(true);
    const adminPage = isAdminPage();
    const paths = getPaths();
    const basePath = `${adminPage ? 'admin' : 'home'}/pages`;
    const path = `${basePath}${paths.join('/')}`;
    const loadLayoutComponent = async () => {
      let layoutComponent: typeof LayoutComponent;
      for (let i = paths.length - 1; i >= 0; i--) {
        const _path = `${basePath}${paths.slice(0, i).join('/')}/${paths[i] ? `${paths[i]}/` : ''}[layout]`;
        layoutComponent = await importPageComponent(_path);
        if (layoutComponent?.default) {
          currentLayout = _path;
          // 布局组件未改变不需要刷新, 只刷新页面组件
          if (preLayout == currentLayout) {
            await loadPageComponent();
            return;
          }
          break;
        }
      }
      if (!layoutComponent?.default) {
        layoutComponent = await import('@common/basic/components/DefaultPageLayout.tsx');
        currentLayout = '';
      }
      setLayoutComponent(React.lazy(async () => layoutComponent));
      await loadPageComponent();
    };
    loadLayoutComponent();
    const loadPageComponent = async () => {
      let pageComponent: typeof PageComponent;
      /* 动态路由处理 */
      for (let i = 0; i < paths.length; i++) {
        const _path = `${basePath}${paths.slice(0, i).join('/')}/${paths[i] ? `${paths[i]}/` : ''}[...]`;
        pageComponent = await importPageComponent(_path);
        if (pageComponent?.default) {
          setPathParams(paths.slice(i + 1));
          const fileFolder = `${adminPage ? '/admin' : ''}${paths.slice(0, i).join('/')}/${paths[i] ? `${paths[i]}/` : ''}`;
          if (!pathParamsPaths.includes(fileFolder)) {
            pathParamsPaths.push(fileFolder);
          }
          break;
        }
      }
      if (!pageComponent?.default && paths.length > 1) {
        const pathParam = paths.slice(0, -1).join('/') + '/[.]';
        pageComponent = await importPageComponent(`${basePath}${pathParam}`);
        if (pageComponent?.default) {
          setPathParams(paths.slice(paths.length - 1));
          const fileFolder = `${adminPage ? '/admin' : ''}${paths.slice(0, -1).join('/')}/`;
          if (!pathParamsPaths.includes(fileFolder)) {
            pathParamsPaths.push(fileFolder);
          }
        }
      }
      /* end */
      /* 普通路由 */
      const indexPath = `${path ? `${path}/` : ''}index`;
      pageComponent = pageComponent
        || await importPageComponent(indexPath)
        || await importPageComponent(path);
      pageComponent = pageComponent?.default ? pageComponent : await import('@common/404.tsx' as never);
      setPageComponent(React.lazy(async () => pageComponent));
      prePath = location.pathname;
      preLayout = currentLayout;
      setPageLoading(false);
    };
  };
  useEffect(() => {
    log.debug('PageLoader -> navigate:', location.pathname);
    /* 防止动态路由页面被刷新 */
    const currentPathMatchPathParamsPathIndex = pathParamsPaths.sort((a, b) => a.length - b.length).findIndex((path) => location.pathname.startsWith(path));
    const prePathMatchPathParamsPathIndex = pathParamsPaths.sort((a, b) => a.length - b.length).findIndex((path) => prePath?.startsWith(path));
    if (prePathMatchPathParamsPathIndex > -1 && prePathMatchPathParamsPathIndex == currentPathMatchPathParamsPathIndex) {
      return;
    }
    /* end */
    const timer = setTimeout(loadPage);
    currentPath = location.pathname;
    return () => clearTimeout(timer);
  }, [location.pathname]);
  useEffect(() => {
    utils.setPageLoading(pageLoading);
  }, [pageLoading]);
  return <Suspense fallback={<PageLoading loading={true} delay={100}/>}>
    <LayoutComponent loading={pageLoading}>
      <div style={{ display: prePath == currentPath ? 'block' : 'none', minHeight: '100%' }}>
        <PageComponent home={isAdminPage() ? '/admin' : '/'} params={pathParams}/>
      </div>
    </LayoutComponent>
  </Suspense>;
};
export default PageLoader;

const isAdminPage = () => window.location.pathname.startsWith('/admin');
const getPaths = () => window.location.pathname.replace(/^\/admin/, '')
  .replace(/\/{2,}/g, '/')
  .replace(/\/?$/g, '')
  .split('/');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pending = () => new Promise<any>(() => {
});
