import {
  Stack,
  Tabs,
  Tab,
  Link as MuiLink,
  Box,
  Typography,
  IconButton,
  Card,
  Avatar
} from '@mui/material';

import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import HomeLogo from './Logo';

import {
  QueryStats,
  VolunteerActivism,
  VerifiedUser,
  ContentCopy,
  Settings
} from '@mui/icons-material';
import { shortenWalletAddressLabel } from '../utils/address';
import { copyToClipboard } from '../utils/copyToClipboard';
import { useSnackbar } from 'notistack';
import AddressAvatar from './AddressAvatar';
import { appRoutes } from '../appRouter';

import { useAccount, useBalance, useEnsAvatar } from 'wagmi';

export default function Navigation() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const account = useAccount();
  const balance = useBalance(account);
  // always load ens avatar from mainnet, as that's where people typically set up avatar
  const { data: avatar, isSuccess } = useEnsAvatar({ ...account, chainId: 1 });

  useMemo(async () => {
    const index = appRoutes.indexOf(pathname);
    if (index !== -1) {
      setTabValue(appRoutes.indexOf(pathname));
    }
  }, [pathname]);

  function AlignedLinkTab(props: any) {
    return (
      <Tab component={Link} {...props} sx={{ alignSelf: 'flex-start' }} iconPosition="start" />
    );
  }

  return (
    <Stack
      sx={{
        ml: 1,
        height: '100vh'
      }}>
      <HomeLogo m={2} />
      {account.isConnected && account.address && (
        <Card
          elevation={10}
          sx={{
            p: 1,
            mt: 5,
            ml: 0.5,
            border: 2,
            borderColor: 'divider',
            borderStyle: 'double',
            borderRadius: 5,
            width: 195,
            height: 90,
            display: 'flex',
            alignItems: 'center'
          }}>
          {isSuccess && avatar ? (
            <Avatar src={avatar as string} sx={{ width: 40, height: 40 }} />
          ) : (
            <AddressAvatar address={account.address?.toString()} />
          )}

          <Box sx={{ ml: 0.5 }}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" color="primary">
                {shortenWalletAddressLabel(account.address?.toString() as string)}
              </Typography>
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  copyToClipboard(account.address?.toString() as string);
                  enqueueSnackbar('Wallet address is copied to clipboard!');
                }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Stack>
            <Typography variant="subtitle2">
              {balance.data?.formatted.substring(0, 7)} ETH
            </Typography>
          </Box>
        </Card>
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
          to={appRoutes[0]}
          icon={<QueryStats />}
        />
        <AlignedLinkTab
          label="Fundraisers"
          tabIndex={1}
          to={appRoutes[1]}
          icon={<VolunteerActivism />}
        />
        <AlignedLinkTab
          label="Validators"
          tabIndex={2}
          component={Link}
          to={appRoutes[2]}
          icon={<VerifiedUser />}
        />
        <AlignedLinkTab
          label="Settings"
          tabIndex={3}
          component={Link}
          to={appRoutes[3]}
          icon={<Settings />}
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
