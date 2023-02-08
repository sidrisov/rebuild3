import { SnackbarProvider } from 'notistack';
import App from './App';

export default function AppWithSnackBar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  );
}
