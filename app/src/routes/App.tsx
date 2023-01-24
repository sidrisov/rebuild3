import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import HomeLogo from '../common/HomeLogo';
import muiTheme from '../common/themeUtils';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => muiTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: darkMode ? '#242424' : '#f8fafc' },
        }}
      />
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <HomeLogo flexGrow={1} />
          <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
          <Button variant="contained">Connect Wallet</Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default App;
