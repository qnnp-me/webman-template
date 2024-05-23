import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@common/assets/styles/main.scss';
import PageLoader from '@common/components/PageLoader.tsx';
import useAppInit from '@common/hooks/useAppInit.ts';

const App = () => {
  useAppInit();
  return (
    <RouterProvider
      router={createBrowserRouter([
        { path: '/admin/*', element: <PageLoader dir={'admin/pages'}/> },
        { path: '*', element: <PageLoader dir={'home/pages'}/> },
      ])}
    />
  );
};
ReactDOM
  .createRoot(document.getElementById('root')!)
  .render(<App/>);
