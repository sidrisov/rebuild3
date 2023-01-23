import { createTheme, Theme } from '@mui/material/styles';

function muiTheme(darkMode: boolean): Theme {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: !darkMode ? 'white' : '',
          },
        },
      },
    },
  });
}

export default muiTheme;
