import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { appRouter } from './appRouter';
import { homeRouter } from './homeRouter';

const isApp = window.location.host.split('.')[0] === 'app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={!isApp ? homeRouter : appRouter} />
  </React.StrictMode>
);
