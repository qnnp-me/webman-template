import 'dayjs/locale/zh-cn';
import * as ReactDOM from 'react-dom/client';

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RouterProvider } from 'react-router-dom';

import '@common/basic/assets/styles/main.scss';
import useAppStorage from '@common/basic/store/useAppStorage.ts';
import { initAxios } from '@common/basic/utils/axios.ts';
import { getRoutes } from '@common/basic/utils/route.tsx';

initAxios();
const GlobalInit = ({ children }: { children: React.ReactNode }) => {
  useAppStorage();
  return children;
};
ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(
    <GlobalInit>
      <ConfigProvider locale={zhCN}>
        <App>
          <RouterProvider router={getRoutes()}/>
        </App>
      </ConfigProvider>
    </GlobalInit>,
  );
