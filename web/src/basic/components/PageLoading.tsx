import { useEffect } from 'react';

import * as utils from '@basic/utils/utils.ts';

export const PageLoading = ({ loading = false, delay = 0, children = null }: {
  loading?: boolean;
  delay?: number;
  children?: React.ReactNode;
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (delay) {
      timer = setTimeout(() => {
        utils.setPageLoading(loading);
      }, delay);
    } else {
      utils.setPageLoading(loading);
    }
    return () => {
      clearTimeout(timer);
      utils.setPageLoading(false);
    };
  }, [loading]);
  return <>{children}</>;
};
