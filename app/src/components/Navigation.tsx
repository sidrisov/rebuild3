import { Stack, Tabs, Tab, Link as MuiLink, Box, Typography } from '@mui/material';
import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeLogo from './Logo';

const paths = ['/app/dashboard', '/app/fundraisers', '/app/validators'];

import { QueryStats, VolunteerActivism, VerifiedUser } from '@mui/icons-material';
import AddressAvatar from './AddressAvatar';
import { shortenWalletAddressLabel } from '../utils/address';
import { UserContext } from '../contexts/UserContext';
import { ethers } from 'ethers';

export default function Navigation() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [balance, setBalance] = useState('');

  const { isWalletConnected, userAddress, provider } = useContext(UserContext);

  useMemo(() => {
    setTabValue(paths.indexOf(pathname));
  }, [pathname]);

  useMemo(async () => {
    if (isWalletConnected) {
      const weiBalance = await provider.getBalance(userAddress);
      setBalance(parseFloat(ethers.utils.formatEther(weiBalance)).toPrecision(8));
    }
    provider.getBalance(userAddress);
  }, [isWalletConnected, userAddress, provider]);

  function AlignedLinkTab(props: any) {
    return (
      <Tab component={Link} {...props} sx={{ alignSelf: 'flex-start' }} iconPosition="start" />
    );
  }

  return (
    <Stack
      sx={{
        ml: 1,
        height: '100vh',
        border: 0,
        borderRight: 1,
        borderColor: 'divider',
        borderStyle: 'dashed'
      }}>
      <HomeLogo m={2} />
      {isWalletConnected && (
        <Box
          sx={{
            m: 1,
            p: 1,
            border: 1,
            borderRadius: 5,
            borderStyle: 'dashed',
            mt: 5,
            width: 180,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              borderStyle: 'solid'
            }
          }}>
          <AddressAvatar size={50} name={userAddress}></AddressAvatar>
          <Box sx={{ ml: 1 }}>
            <Typography variant="h6" color="grey">
              {shortenWalletAddressLabel(userAddress)}
            </Typography>
            <Typography variant="subtitle2">{balance} ETH</Typography>
          </Box>
        </Box>
      )}

      <Tabs
        orientation="vertical"
        variant="scrollable"
        scrollButtons="auto"
        value={tabValue}
        sx={{
          mt: 5,
          minWidth: 200,
          flexGrow: 1
        }}>
        <AlignedLinkTab
          label="Dashboard"
          tabIndex={0}
          component={Link}
          to={paths[0]}
          icon={<QueryStats />}
        />
        <AlignedLinkTab
          label="Fundraisers"
          tabIndex={1}
          to={paths[1]}
          icon={<VolunteerActivism />}
        />
        <AlignedLinkTab
          label="Validators"
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
