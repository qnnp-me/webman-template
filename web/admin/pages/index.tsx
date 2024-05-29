import log from 'loglevel';
import { useEffect } from 'react';

import { Link } from 'react-router-dom';

export default function PageAdminHome() {
  useEffect(() => {
    log.debug('PageAdminHome -> init', location.pathname);
  }, []);
  return (
    <div>
      <h1>Hello, world!</h1>
      {[
        '/',
        '/admin/iframe/app/admin/plugin/index',
        '/admin/login',
        '/admin/test',
        '/admin/test/',
        '/admin/test/test1/',
        '/admin/test/test1/test2',
        '/admin/asd',
        '/admin/asd/test',
        '/admin/asd/test/test1',
        '/test',
        '/test/',
        '/test/test1/test2',
      ].map(path => <div key={path}>
        <Link to={path}>path: {path}</Link>
      </div>)}
    </div>
  );
}
