import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export default function AppWithSnackBarAndHelmet() {
  return (
    <HelmetProvider>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </HelmetProvider>
  );
}
