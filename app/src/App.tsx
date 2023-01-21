import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, yellow } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AppBar, IconButton, Toolbar } from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [count, setCount] = useState(0);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          //primary: blue,
          //secondary: yellow,
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: darkMode ? '#121212' : '#f8fafc' },
        }}
      />
      <AppBar position="fixed" color="primary">
        <Toolbar variant="dense">
          <IconButton
            onClick={() => setDarkMode((darkMode) => !darkMode)}
            color="inherit">
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
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
