import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import '../styles/App.css';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import reactLogo from '../assets/react.svg';
import HomeLogo from '../common/HomeLogo';
import muiTheme from '../common/themeUtils';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [count, setCount] = useState(0);

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
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/cubes.svg" className="logo" alt="ReBuild3 logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <Link to={'/'}>Home</Link>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </ThemeProvider>
  );
}

export default App;
