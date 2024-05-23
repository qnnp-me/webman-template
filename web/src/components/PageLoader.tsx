import React, { Suspense, useMemo } from 'react';

import { useLocation } from 'react-router-dom';

const Spin = () => {
  return <div></div>;
};
const PageLoader = ({ dir }: { dir: string }) => {
  dir = `${dir.replace(/\/?(.*)\/?$/, '$1')}/pages`;
  const location = useLocation();
  let path = location.pathname;
  if (/^\/admin\/?/.test(path)) {
    path = path.replace(/^\/admin/, '');
  }
  const file = `${dir}${path}/index`.replace(/\/\//g, '/');
  const Component = useMemo(() => React.lazy(() => new Promise((resolve) => {
        import(`../../${file}.tsx`)
          .then(resolve)
          .catch(() => import(`../../${file.replace(/\/index$/, '')}.tsx`))
          .then(resolve)
          .catch(() => import('../404.tsx' as never))
          .then(resolve);
      }),
    ), [location.pathname],
  );
  return <Suspense
    fallback={<Spin/>}
  >
    <Component home={'/admin'}/>
  </Suspense>;
};
export default PageLoader;
