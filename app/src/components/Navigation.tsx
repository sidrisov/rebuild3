import { Stack, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeLogo from './Logo';

const paths = ['/app/dashboard', '/app/applications', '/app/validators'];

export default function Navigation() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTabValue(paths.indexOf(pathname));
  }, [pathname]);

  return (
    <Stack spacing={10} sx={{ alignItems: 'center', display: 'flex' }}>
      <HomeLogo m={3} />
      <Tabs
        orientation="vertical"
        variant="scrollable"
        scrollButtons="auto"
        value={tabValue}
        sx={{ minWidth: 250, height: '100%', borderRight: 1, borderColor: 'divider' }}>
        <Tab label="Dashboard" tabIndex={0} component={Link} to={paths[0]} />
        <Tab label="Applications" tabIndex={1} component={Link} to={paths[1]} />
        <Tab label="Validators" tabIndex={2} component={Link} to={paths[2]} />
      </Tabs>
    </Stack>
  );
}
