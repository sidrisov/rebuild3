import { createBrowserRouter } from 'react-router-dom';
import Home from './layouts/Home';
import Page404 from './pages/Page404';

export const homeRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Page404 />
  }
]);
