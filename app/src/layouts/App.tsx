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
  PowerSettingsNew,
  LightModeOutlined,
  DarkModeOutlined,
  Menu,
  Wallet
} from '@mui/icons-material';

import Nav from '../components/Navigation';

import { Magic } from 'magic-sdk';
import { EthNetworkName } from '@magic-sdk/types';
import { ethers } from 'ethers';

import { ConnectExtension, WalletInfo } from '@magic-ext/connect';
import { shortenWalletAddressLabel } from '../utils/address';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';

import Rebuild3ContractArtifact from '../../../solidity/artifacts/contracts/ReBuild3.sol/ReBuild3.json';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { UserContext } from '../contexts/UserContext';
import Moralis from 'moralis';
import { CampaignFilters } from '../types/CampaignFiltersType';
import HideOnScroll from '../components/HideOnScroll';

import { WalletTypeAvatar, WalletTypeName } from '../components/WalletType';
import { AppSettings } from '../types/AppSettingsType';

const MAGIC_SUPPORTED = import.meta.env.VITE_MAGIC_SUPPORTED === 'true';
const MAGIC_ENABLED = import.meta.env.VITE_MAGIC_ENABLED === 'true' && MAGIC_SUPPORTED;
const INIT_CONNECT = import.meta.env.VITE_INIT_CONNECT === 'true';

var magic: InstanceWithExtensions<SDKBase, ConnectExtension[]>;
var magicSignerProvider: ethers.providers.Web3Provider | undefined;
var embeddedSignerProvider: ethers.providers.Web3Provider | undefined;

// if magic enabled
if (MAGIC_SUPPORTED) {
  magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
    network: import.meta.env.VITE_DEFAULT_NETWORK as EthNetworkName,
    extensions: [new ConnectExtension()]
  });
  magic.preload();
  magicSignerProvider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
}

if (window.ethereum) {
  embeddedSignerProvider = new ethers.providers.Web3Provider(window.ethereum as any);
}

// use alchemy as default provider, fallback to wallet provider if network wasn't set up, e.g. local hardhat
const defaultProvider =
  import.meta.env.VITE_DEFAULT_NETWORK === ''
    ? embeddedSignerProvider
    : new ethers.providers.AlchemyProvider(
        import.meta.env.VITE_DEFAULT_NETWORK,
        import.meta.env.VITE_ALCHEMY_API_KEY
      );

Moralis.start({
  apiKey: import.meta.env.VITE_MORALIS_API_KEY
});

const drawerWidth = 220;

export default function AppLayout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [rb3Contract, setRB3Contract] = useState<ReBuild3>();
  const [regions, setRegions] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<ReBuild3.OrganizationStructOutput[]>([]);
  const [threshold, setThreshold] = useState('N/A');
  const [campaigns, setCampaigns] = useState<ReBuild3.CampaignStructOutput[]>([]);
  const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>({
    user: 'all',
    status: 'all',
    region: 'all'
  });

  const [walletType, setWalletType] = useState<WalletInfo['walletType']>();
  const [isSubscribedToEvents, setSubscribedToEvents] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signerProvider, setSignerProvider] = useState<ethers.providers.Web3Provider | undefined>();
  const [appSettings, setAppSettings] = useState<AppSettings>({
    magicEnabled: MAGIC_ENABLED,
    connectOnDemand: INIT_CONNECT,
    darkMode: prefersDarkMode
  });

  useMemo(async () => {
    // reset filters whenever user changes the connection state
    setCampaignFilters({ user: 'all', status: 'all', region: 'all' });

    if (!isWalletConnected && defaultProvider) {
      const contract = new ethers.Contract(
        import.meta.env.VITE_REBUILD3_CONTRACT_ADDR,
        Rebuild3ContractArtifact.abi,
        defaultProvider
      ) as ReBuild3;

      setRB3Contract(contract);
    }
  }, [isWalletConnected]);

  useMemo(async () => {
    if (appSettings.magicEnabled) {
      setSignerProvider(magicSignerProvider);
    } else if (window.ethereum) {
      // otherwise try to use metamask provider
      setSignerProvider(embeddedSignerProvider);
    }
  }, [appSettings.magicEnabled]);

  useMemo(async () => {
    if (isWalletConnected) {
      await disconnectWallet();
    }
    if (signerProvider && appSettings.connectOnDemand) {
      console.log('Initializing wallet connect on start up!');
      connectWallet();
    }
  }, [signerProvider, appSettings.connectOnDemand]);

  async function connectWallet() {
    if (!signerProvider) {
      enqueueSnackbar('Wallet Provider is not available!', { variant: 'warning' });
      return;
    }

    if (!appSettings.magicEnabled) {
      await signerProvider.send('eth_requestAccounts', []);
    }

    const signer = signerProvider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(
      import.meta.env.VITE_REBUILD3_CONTRACT_ADDR,
      Rebuild3ContractArtifact.abi,
      defaultProvider
    ) as ReBuild3;

    const connectedWalletType = appSettings.magicEnabled
      ? (await magic.connect.getWalletInfo()).walletType
      : 'metamask'; // TODO: for now consider it as metamask, however in future we might support other embedded wallets

    enqueueSnackbar(WalletTypeName(connectedWalletType) + ' Connected!', { variant: 'success' });

    setRB3Contract(contract.connect(signer));
    setUserAddress(address);
    setWalletType(connectedWalletType);
    setWalletConnected(true);
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function fetchRegionData(contract: ReBuild3) {
    if (contract !== undefined) {
      const regions = await contract.getActiveRegions();
      setRegions(regions);
    }
  }

  // TODO: make donations public or introduce a new API in contract
  /*   async function fetchDonationData(contract: ReBuild3) {
    if (contract !== undefined) {
      const regions = await contract.donations();
      setDonations(regions);
    }
  } */

  async function fetchConfig(contract: ReBuild3) {
    if (contract !== undefined) {
      const thresholdWei = await rb3Contract?.goalThreshold();

      if (thresholdWei) {
        setThreshold(ethers.utils.formatEther(thresholdWei));
      }
    }
  }

  async function fetchOrganizationData(contract: ReBuild3) {
    if (contract !== undefined) {
      const organizations = await contract.getAllOrganizations();
      setOrganizations(organizations);
    }
  }
  async function fetchCampaignData(contract: ReBuild3) {
    if (contract !== undefined) {
      const campaigns = await contract.getAllCampaigns();
      setCampaigns(campaigns);
    }
  }

  async function subscribeToAllEvents(contract: ReBuild3) {
    if (contract !== undefined) {
      // subscribe from the next block
      defaultProvider?.once('block', async () => {
        contract.once(contract.filters.RegionActivated(), () => {
          fetchRegionData(contract);
          enqueueSnackbar('New region registered!', { variant: 'success' });
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.RegionDeactivated(), () => {
          fetchRegionData(contract);
          enqueueSnackbar('Region deactivated!', { variant: 'warning' });
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.OrganizationRegistered(), () => {
          fetchOrganizationData(contract);
          enqueueSnackbar('New organization registered!', { variant: 'success' });
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.OrganizationDeactivated(), () => {
          fetchOrganizationData(contract);
          enqueueSnackbar('Organiation deactivated!', { variant: 'warning' });
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.CampaignCreated(), () => {
          fetchCampaignData(contract);
          enqueueSnackbar('New campaign created!', { variant: 'success' });
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.CampaignActive(), () => {
          fetchCampaignData(contract);
          enqueueSnackbar('Campaing is available for donations!', { variant: 'info' });
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.CampaignSuccess(), () => {
          fetchCampaignData(contract);
          enqueueSnackbar('Campaign was successful!', { variant: 'success' });
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.DonationMade(), () => {
          fetchCampaignData(contract);
          enqueueSnackbar('New donation was made!', { variant: 'info' });
          setSubscribedToEvents(false);
        });
      });
    }
  }

  useMemo(async () => {
    // load all countries
    if (rb3Contract) {
      fetchConfig(rb3Contract);
      fetchRegionData(rb3Contract);
      fetchOrganizationData(rb3Contract);
      fetchCampaignData(rb3Contract);
    }
  }, [rb3Contract]);

  useMemo(async () => {
    if (!isSubscribedToEvents && rb3Contract) {
      subscribeToAllEvents(rb3Contract);
      setSubscribedToEvents(true);
    }
  }, [isSubscribedToEvents, rb3Contract]);

  async function disconnectWallet() {
    if (MAGIC_SUPPORTED) {
      await magic.connect.disconnect();
    }

    setWalletConnected(false);
  }

  const drawer = <Nav />;
  return (
    <CustomThemeProvider darkMode={appSettings.darkMode}>
      <UserContext.Provider
        value={{
          isWalletConnected,
          userAddress,
          provider: defaultProvider,
          regions,
          organizations,
          contract: rb3Contract,
          campaigns,
          threshold,
          campaignFilters,
          setCampaignFilters,
          appSettings,
          setAppSettings
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
            {
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
                open>
                {drawer}
              </Drawer>
            }
          </Box>
          <Box flexGrow={1}>
            <HideOnScroll>
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
                    <IconButton
                      onClick={() =>
                        setAppSettings({ ...appSettings, darkMode: !appSettings.darkMode })
                      }>
                      {appSettings.darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
                    </IconButton>

                    {!isWalletConnected ? (
                      <Button
                        variant="contained"
                        endIcon={<Wallet />}
                        onClick={() => {
                          connectWallet();
                        }}
                        sx={{ width: 155 }}>
                        Connect
                      </Button>
                    ) : (
                      <Chip
                        label={shortenWalletAddressLabel(userAddress)}
                        clickable={walletType === 'magic'}
                        onClick={async () => {
                          if (walletType === 'magic') {
                            await magic.connect.showWallet();
                          }
                        }}
                        avatar={<WalletTypeAvatar wallettype={walletType} address={userAddress} />}
                        sx={{
                          height: 40,
                          width: 155,
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
            </HideOnScroll>

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
