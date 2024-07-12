initAxios();
const GlobalInit = ({ children }: { children: React.ReactNode }) => {
  useAppStorage();
  return children;
};

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'sanitize.css';

import '@common/basic/assets/styles/main.scss';
import useAppStorage from '@common/basic/store/useAppStorage.ts';
import { initAxios } from '@common/basic/utils/axios.ts';
import { getRoutes } from '@common/basic/utils/route.tsx';

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <GlobalInit>
      <ConfigProvider locale={zhCN} theme={{ cssVar: true }}>
        <App>
          <RouterProvider router={getRoutes()} />
        </App>
      </ConfigProvider>
    </GlobalInit>,
  );
