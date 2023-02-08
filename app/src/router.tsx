import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './layouts/Home';
import App from './layouts/App';
import Page404 from './pages/Page404';
import Dashboard from './pages/Dashboard';
import Fundraisers from './pages/Fundraisers';
import Validators from './pages/Validators';
import Settings from './pages/Settings';

import AppWithSnackBar from './layouts/AppWithSnackBar';

export const routes = ['/app/dashboard', '/app/fundraisers', '/app/validators', '/app/settings'];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Page404 />
  },
  {
    path: '/app',
    element: <AppWithSnackBar />,
    errorElement: <Page404 />,
    children: [
      { element: <Navigate to="/app/dashboard" />, index: true },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'fundraisers', element: <Fundraisers /> },
      { path: 'validators', element: <Validators /> },
      { path: 'settings', element: <Settings /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> }
    ]
  }
]);
