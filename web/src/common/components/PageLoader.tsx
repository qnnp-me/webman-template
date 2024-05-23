import React, { Suspense, useMemo } from 'react';

import { Spin } from 'antd';
import { useLocation } from 'react-router-dom';

const PageLoader = ({ dir }: { dir: string }) => {
  dir = `${dir.replace(/\/?(.*)\/?$/, '$1')}`;
  const location = useLocation();
  let path = location.pathname;
  if (/^\/admin\/?/.test(path)) {
    path = path.replace(/^\/admin/, '');
  }
  const file = `${dir}${path}/index.tsx`.replace(/\/\//g, '/');
  console.log(JSON.stringify({
    'location.pathname': location.pathname,
    dir,
    path,
    file,
    backup: file.replace(/\/index\.tsx$/, '.tsx'),
  }, null, 2));
  const Component = useMemo(() => React.lazy(() => new Promise((resolve) => {
        import(`../../../${file}`)
          .then(resolve)
          .catch(() => import(`../../../${file.replace(/\/index\.tsx$/, '.tsx')}.tsx`))
          .then(resolve)
          .catch(() => import('../../common/404.tsx' as never))
          .then(resolve);
      }),
    ), [location.pathname],
  );
  return <Suspense
    fallback={<Spin
      tip={'加载中...'}
      fullscreen
      delay={100}
      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
    />}
  >
    <Component home={'/admin'}/>
  </Suspense>;
};
export default PageLoader;
