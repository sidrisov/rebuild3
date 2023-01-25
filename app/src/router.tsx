import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import AppLayout from './layouts/AppLayout';
import Page404 from './routes/Page404';
import Dashboard from './routes/Dashboard';
import Applications from './routes/Applications';
import Validators from './routes/Validators';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Page404 />
  },
  {
    path: '/app',
    element: <AppLayout />,
    errorElement: <Page404 />,
    children: [
      { element: <Navigate to="/app/applications" />, index: true },
      { path: '/app/dashboard', element: <Dashboard /> },
      { path: 'applications', element: <Applications /> },
      { path: 'validators', element: <Validators /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> }
    ]
  }
]);
