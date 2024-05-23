import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@common/assets/styles/main.scss';
import PageLoader from '@common/components/PageLoader.tsx';
import useAppInit from '@common/hooks/useAppInit.ts';

const App = () => {
  useAppInit();
  return React.createElement(
    RouterProvider,
    {
      router: createBrowserRouter([
        { path: '/admin/*', element: React.createElement(PageLoader, { dir: 'admin' }) },
        { path: '*', element: React.createElement(PageLoader, { dir: 'home' }) },
      ]),
    },
  );
};
ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(React.createElement(App));
