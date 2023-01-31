import { Stack, Tabs, Tab, Link as MuiLink } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeLogo from './Logo';

const paths = ['/app/dashboard', '/app/applications', '/app/validators'];

import { QueryStats, VolunteerActivism, VerifiedUser } from '@mui/icons-material';

export default function Navigation() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTabValue(paths.indexOf(pathname));
  }, [pathname]);

  function AlignedLinkTab(props: any) {
    return (
      <Tab
        component={Link}
        {...props}
        sx={{ ml: 2, justifyContent: 'flex-start', alignItems: 'center' }}
        iconPosition="start"
      />
    );
  }

  return (
    <Stack
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: 0,
        borderRight: 1,
        borderColor: 'divider',
        borderStyle: 'dashed'
      }}>
      <HomeLogo alignSelf="self-start" mt={2} ml={4} />
      <Tabs
        orientation="vertical"
        variant="scrollable"
        scrollButtons="auto"
        value={tabValue}
        sx={{ mt: 20, minWidth: 250, flexGrow: 1 }}>
        <AlignedLinkTab
          label="Dashboard"
          tabIndex={0}
          component={Link}
          to={paths[0]}
          icon={<QueryStats />}
        />
        <AlignedLinkTab
          label="Fundraising"
          tabIndex={1}
          to={paths[1]}
          icon={<VolunteerActivism />}
        />
        <AlignedLinkTab
          label="Organisations"
          tabIndex={2}
          component={Link}
          to={paths[2]}
          icon={<VerifiedUser />}
        />
      </Tabs>
      <MuiLink
        mb={1}
        ml={4}
        variant="overline"
        underline="hover"
        color="grey"
        href="https://github.com/sidrisov">
        Made by Sinaver
      </MuiLink>
    </Stack>
  );
}
