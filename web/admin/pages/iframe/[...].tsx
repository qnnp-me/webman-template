import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import * as utils from '@common/basic/utils/utils.ts';

export default function PageAdminIframe() {
  const { pathname } = useLocation();
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    log.debug('PageAdminIframe -> init', pathname);
  }, []);
  const path = window.location.pathname
    .replace(/^\/admin\/iframe/, '')
    .replace(/^\/([^/]+)(\/\/)/, '$1:$2');
  useEffect(() => {
    setSrc(undefined);
    utils.setPageLoading(true);
    setTimeout(() => {
      setSrc(path);
    });
    return () => {
      utils.setPageLoading(false);
    };
  }, [pathname]);
  const iframe = useRef<HTMLIFrameElement>();
  return (
    path === src ? <iframe
      ref={iframe as never}
      onLoad={() => {
        utils.setPageLoading(false);
        log.debug('PageAdminIframe -> onLoad', pathname);
      }}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      src={src}
    /> : null
  );
}
