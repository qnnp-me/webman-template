import {App, ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import * as ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import 'sanitize.css';

import '@basic/assets/styles/main.scss';
import {GlobalInit} from '@basic/components/GlobalInit.tsx';
import {initAxios} from '@basic/utils/axios.ts';
import {getRoutes} from '@basic/utils/route.tsx';

initAxios();

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <GlobalInit>
      <ConfigProvider locale={zhCN} theme={{cssVar: true}}>
        <App>
          <RouterProvider
            router={getRoutes(import.meta.glob([
              '@home/**/*.tsx',
              '!@home/**/_*.tsx',
            ]))}
          />
        </App>
      </ConfigProvider>
    </GlobalInit>,
  );
