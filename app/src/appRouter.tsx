import { createBrowserRouter, Navigate } from 'react-router-dom';
import Page404 from './pages/Page404';
import Dashboard from './pages/Dashboard';
import Fundraisers from './pages/Fundraisers';
import Validators from './pages/Validators';
import Settings from './pages/Settings';

import AppWithSnackBar from './layouts/AppWithSnackBar';

export const appRoutes = ['/dashboard', '/fundraisers', '/validators', '/settings'];

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppWithSnackBar />,
    errorElement: <Page404 />,
    children: [
      { element: <Navigate to="/dashboard" />, index: true },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'fundraisers', element: <Fundraisers /> },
      { path: 'validators', element: <Validators /> },
      { path: 'settings', element: <Settings /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> }
    ]
  }
]);
