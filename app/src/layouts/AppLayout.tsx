import { useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { AppBar, Button, IconButton, Tab, Tabs, Toolbar, Box } from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import HomeLogo from '../components/Logo';
import CustomThemeProvider from '../theme/CustomThemeProvider';

const paths = ['/app/dashboard', '/app/applications', '/app/validators'];

function AppLayout() {
  const { pathname } = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTabValue(paths.indexOf(pathname));
  }, [pathname]);

  return (
    <CustomThemeProvider darkMode={darkMode}>
      <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <HomeLogo flexGrow={1} />
          <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
          <Button variant="contained">Connect Wallet</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.card',
          display: 'flex',
          alignItems: 'center'
        }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          sx={{ width: 200, height: '100%', borderRight: 1, borderColor: 'divider' }}>
          <Tab label="Dashboard" tabIndex={0} component={Link} to={paths[0]} />
          <Tab label="Applications" tabIndex={1} component={Link} to={paths[1]} />
          <Tab label="Validators" tabIndex={2} component={Link} to={paths[2]} />
        </Tabs>
        <Outlet />
      </Box>
    </CustomThemeProvider>
  );
}

export default AppLayout;
