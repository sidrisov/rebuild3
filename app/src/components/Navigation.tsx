import {
  Stack,
  Tabs,
  Tab,
  Link as MuiLink,
  Box,
  Typography,
  IconButton,
  Card
} from '@mui/material';

import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import HomeLogo from './Logo';

const paths = ['/app/dashboard', '/app/fundraisers', '/app/validators'];

import { QueryStats, VolunteerActivism, VerifiedUser, ContentCopy } from '@mui/icons-material';
import { shortenWalletAddressLabel } from '../utils/address';
import { UserContext } from '../contexts/UserContext';
import { ethers } from 'ethers';
import { copyToClipboard } from '../utils/copyToClipboard';
import { useSnackbar } from 'notistack';
import AddressAvatar from './AddressAvatar';

export default function Navigation() {
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [balance, setBalance] = useState('');

  const { isWalletConnected, userAddress, provider } = useContext(UserContext);

  const { enqueueSnackbar } = useSnackbar();

  useMemo(() => {
    setTabValue(paths.indexOf(pathname));
  }, [pathname]);

  useMemo(async () => {
    if (isWalletConnected && provider) {
      const weiBalance = await provider.getBalance(userAddress);
      setBalance(parseFloat(ethers.utils.formatEther(weiBalance)).toPrecision(8));
    }
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
        height: '100vh'
      }}>
      <HomeLogo m={2} />
      {isWalletConnected && (
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
          <AddressAvatar address={userAddress} />
          <Box sx={{ ml: 0.5 }}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" color="primary">
                {shortenWalletAddressLabel(userAddress)}
              </Typography>
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  copyToClipboard(userAddress);
                  enqueueSnackbar('Wallet address is copied to clipboard!');
                }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Stack>
            <Typography variant="subtitle2">{balance} ETH</Typography>
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
