import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Box,
  Container,
  Chip,
  useMediaQuery,
  Drawer
} from '@mui/material';

import { useSnackbar } from 'notistack';

import CustomThemeProvider from '../theme/CustomThemeProvider';
import {
  Wallet,
  PowerSettingsNew,
  LightModeOutlined,
  DarkModeOutlined,
  Menu
} from '@mui/icons-material';
import Nav from '../components/Navigation';

import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

import { ConnectExtension } from '@magic-ext/connect';
import { shortenWalletAddressLabel } from '../utils/address';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';

import Rebuild3ContractArtifact from '../../../solidity/artifacts/contracts/RB3Fundraising.sol/RB3Fundraising.json';
import { RB3Fundraising } from '../../../solidity/typechain-types';
import AddressAvatar from '../components/AddressAvatar';
import { UserContext } from '../contexts/UserContext';
import Moralis from 'moralis';

const MAGIC_ENABLED = import.meta.env.VITE_MAGIC_ENABLED === 'true';
const INIT_CONNECT = import.meta.env.VITE_INIT_CONNECT === 'true';

var magic: InstanceWithExtensions<SDKBase, ConnectExtension[]>;
var provider: ethers.providers.Web3Provider;

if (MAGIC_ENABLED) {
  magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
    network: 'goerli',
    locale: 'en_US',
    extensions: [new ConnectExtension()]
  });
  magic.preload();
  provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
} else {
  // TODO: add check so that it can be opened on mobile, need to add further checks across all calls
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum as any);
  }
}

Moralis.start({
  apiKey: import.meta.env.VITE_MORALIS_API_KEY
});

const drawerWidth = 220;

export default function AppLayout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [rb3Contract, setRB3Contract] = useState<RB3Fundraising>();
  const [regions, setRegions] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<RB3Fundraising.OrganizationStructOutput[]>([]);
  const [campaigns, setCampaigns] = useState<RB3Fundraising.CampaignStructOutput[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function connectWallet() {
    if (!MAGIC_ENABLED) {
      await provider.send('eth_requestAccounts', []);
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(
      import.meta.env.VITE_REBUILD3_CONTRACT_ADDR,
      Rebuild3ContractArtifact.abi,
      signer
    ) as RB3Fundraising;

    setRB3Contract(contract);
    setUserAddress(address);
    setWalletConnected(true);

    enqueueSnackbar((MAGIC_ENABLED ? 'Magic ' : '') + 'Wallet Connected!', { variant: 'success' });
  }

  useMemo(async () => {
    if (INIT_CONNECT) {
      console.log('Initializing wallet connect on start up!');
      connectWallet();
    }
  }, []);

  async function fetchRegionData(contract: RB3Fundraising) {
    if (contract !== undefined) {
      const regions = await contract.getActiveRegions();
      setRegions(regions);
    }
  }

  async function fetchOrganizationData(contract: RB3Fundraising) {
    if (contract !== undefined) {
      const organizations = await contract.getAllOrganizations();
      setOrganizations(organizations);
    }
  }
  async function fetchCampaignData(contract: RB3Fundraising) {
    if (contract !== undefined) {
      const campaigns = await contract.getAllCampaigns();
      setCampaigns(campaigns);
    }
  }

  async function subscribeToAllEvents(contract: RB3Fundraising) {
    if (contract !== undefined) {
      contract.removeAllListeners();
      contract.on(contract.filters.RegionActivated(), (event) => {
        fetchRegionData(contract);
        enqueueSnackbar('New region registered!', { variant: 'success' });
      });

      contract.on(contract.filters.RegionDeactivated(), (event) => {
        fetchRegionData(contract);
        enqueueSnackbar('Region deactivated!', { variant: 'warning' });
      });

      contract.on(contract.filters.OrganizationRegistered(), (event) => {
        fetchOrganizationData(contract);
        enqueueSnackbar('New organization registered!', { variant: 'success' });
      });
      contract.on(contract.filters.OrganizationDeactivated(), (event) => {
        fetchOrganizationData(contract);
        enqueueSnackbar('Organiation deactivated!', { variant: 'warning' });
      });

      contract.on(contract.filters.CampaignCreated(), (event) => {
        fetchCampaignData(contract);
        enqueueSnackbar('New campaign created!', { variant: 'success' });
      });
      contract.on(contract.filters.CampaignActive(), (event) => {
        fetchCampaignData(contract);
        enqueueSnackbar('Campaing is available for donations!', { variant: 'info' });
      });
      contract.on(contract.filters.CampaignSuccess(), (event) => {
        fetchCampaignData(contract);
        enqueueSnackbar('Campaign was successful!', { variant: 'success' });
      });
      contract.on(contract.filters.DonationMade(), (event) => {
        fetchCampaignData(contract);
        enqueueSnackbar('New donation was made!', { variant: 'info' });
      });
    }
  }

  useMemo(async () => {
    // load all countries
    if (isWalletConnected && rb3Contract !== undefined) {
      fetchRegionData(rb3Contract);
      fetchOrganizationData(rb3Contract);
      fetchCampaignData(rb3Contract);

      // listen to all events
      subscribeToAllEvents(rb3Contract);
    }
  }, [isWalletConnected, rb3Contract]);

  async function disconnectWallet(): Promise<void> {
    if (MAGIC_ENABLED) {
      await magic.connect.disconnect();
    }

    setWalletConnected(false);
  }

  const drawer = <Nav />;
  return (
    <CustomThemeProvider darkMode={darkMode}>
      <UserContext.Provider
        value={{
          darkMode,
          isWalletConnected,
          userAddress,
          provider,
          regions,
          organizations,
          contract: rb3Contract,
          campaigns
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}>
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
              }}>
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
              }}
              open>
              {drawer}
            </Drawer>
          </Box>
          <Box flexGrow={1}>
            <AppBar
              position="sticky"
              color="transparent"
              elevation={0}
              sx={{ backdropFilter: 'blur(5px)' }}>
              <Toolbar
                sx={{
                  justifyContent: 'space-between'
                }}>
                <Box>
                  <IconButton
                    color="inherit"
                    onClick={handleDrawerToggle}
                    sx={{ display: { sm: 'none' } }}>
                    <Menu />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
                    {darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
                  </IconButton>

                  {!isWalletConnected ? (
                    <Button
                      variant="contained"
                      endIcon={<Wallet />}
                      onClick={() => {
                        connectWallet();
                      }}
                      sx={{ width: 150 }}>
                      Connect
                    </Button>
                  ) : (
                    <Chip
                      label={shortenWalletAddressLabel(userAddress)}
                      onClick={() => {
                        if (MAGIC_ENABLED) {
                          magic.connect.showWallet();
                        }
                      }}
                      icon={
                        <Box display="flex">
                          <AddressAvatar size={25} name={userAddress} />
                        </Box>
                      }
                      sx={{
                        height: 40,
                        width: 150,
                        fontSize: 15,
                        fontWeight: 'bold'
                      }}
                      deleteIcon={<PowerSettingsNew />}
                      onDelete={() => {
                        disconnectWallet();
                      }}
                    />
                  )}
                </Box>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                my: 5,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row'
              }}>
              <Container>
                <Outlet />
              </Container>
            </Box>
          </Box>
        </Box>
      </UserContext.Provider>
    </CustomThemeProvider>
  );
}
