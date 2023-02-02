import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './layouts/Home';
import App from './layouts/App';
import Page404 from './routes/Page404';
import Dashboard from './routes/Dashboard';
import Fundraisers from './routes/Fundraisers';
import Validators from './routes/Validators';

import { SnackbarProvider } from 'notistack';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Page404 />
  },
  {
    path: '/app',
    element: (
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    ),
    errorElement: <Page404 />,
    children: [
      { element: <Navigate to="/app/dashboard" />, index: true },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'fundraisers', element: <Fundraisers /> },
      { path: 'validators', element: <Validators /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> }
    ]
  }
]);
