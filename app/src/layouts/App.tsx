import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { AppBar, IconButton, Toolbar, Box, Container, Drawer, Stack } from '@mui/material';

import CustomThemeProvider from '../theme/CustomThemeProvider';
import { LightModeOutlined, DarkModeOutlined, Menu } from '@mui/icons-material';

import Nav from '../components/Navigation';

import { ethers } from 'ethers';

import Rebuild3ContractArtifact from '../../../solidity/artifacts/contracts/ReBuild3.sol/ReBuild3.json';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { UserContext } from '../contexts/UserContext';
import Moralis from 'moralis';
import { CampaignFilters } from '../types/CampaignFiltersType';
import HideOnScroll from '../components/HideOnScroll';

import { useAccount, useContract, useNetwork, useProvider, useSigner } from 'wagmi';
import { toast } from 'react-toastify';

// TODO: enable magic link once there is a working wagmi connector available
/*
const MAGIC_SUPPORTED = import.meta.env.VITE_MAGIC_SUPPORTED === 'true';
const MAGIC_ENABLED = import.meta.env.VITE_MAGIC_ENABLED === 'true' && MAGIC_SUPPORTED;

var magic;
var magicSignerProvider: ethers.providers.Web3Provider | undefined;

// if magic enabled
if (MAGIC_SUPPORTED) {
  magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
    network: import.meta.env.VITE_DEFAULT_NETWORK as EthNetworkName
  });
  magic.preload();
  magicSignerProvider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
} */

Moralis.start({
  apiKey: import.meta.env.VITE_MORALIS_API_KEY
});

const drawerWidth = 220;

interface ContractAddressPerNetwork {
  network: string;
  address: string;
}

const contracts = JSON.parse(
  import.meta.env.VITE_CONTRACTS_PER_NETWORK
) as ContractAddressPerNetwork[];

export default function AppLayout({ appSettings, setAppSettings }: any) {
  //const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const defaultProvider = useProvider();
  const signer = useSigner();
  const { isConnected: isWalletConnected, address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const rb3Contract = useContract({
    address: contracts.find((contract) => (chain ? contract.network === chain?.network : true))
      ?.address,
    abi: Rebuild3ContractArtifact.abi,
    signerOrProvider: signer.data || defaultProvider
  }) as ReBuild3;

  const [regions, setRegions] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<ReBuild3.OrganizationStructOutput[]>([]);
  const [threshold, setThreshold] = useState('N/A');
  const [campaigns, setCampaigns] = useState<ReBuild3.CampaignStructOutput[]>([]);
  const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>({
    user: 'all',
    status: 'all',
    region: 'all'
  });

  const [isSubscribedToEvents, setSubscribedToEvents] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMemo(async () => {
    // reset filters whenever user changes the connection state
    setCampaignFilters({ user: 'all', status: 'all', region: 'all' });
  }, [isWalletConnected]);

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
          toast.success('New region registered!');
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.RegionDeactivated(), () => {
          fetchRegionData(contract);
          toast.warn('Region deactivated!');
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.OrganizationRegistered(), () => {
          fetchOrganizationData(contract);
          toast.success('New organization registered!');
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.OrganizationDeactivated(), () => {
          fetchOrganizationData(contract);
          toast.warn('Organiation deactivated!');
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.CampaignCreated(), () => {
          fetchCampaignData(contract);
          toast.success('New campaign created!');
          setSubscribedToEvents(false);
        });

        contract.once(contract.filters.CampaignActive(), () => {
          fetchCampaignData(contract);
          toast.info('Campaing is available for donations!');
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.CampaignSuccess(), () => {
          fetchCampaignData(contract);
          toast.success('Campaign was successful!');
          setSubscribedToEvents(false);
        });
        contract.once(contract.filters.DonationMade(), () => {
          fetchCampaignData(contract);
          toast.info('New donation was made!');
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
    } else {
      setRegions([]);
      setOrganizations([]);
      setCampaigns([]);
      setThreshold('N/A');
    }
  }, [rb3Contract]);

  useMemo(async () => {
    if (!isSubscribedToEvents && rb3Contract) {
      subscribeToAllEvents(rb3Contract);
      setSubscribedToEvents(true);
    }
  }, [isSubscribedToEvents, rb3Contract]);

  const drawer = <Nav />;
  return (
    <CustomThemeProvider darkMode={appSettings.darkMode}>
      <UserContext.Provider
        value={{
          isWalletConnected,
          userAddress: userAddress,
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
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() =>
                        setAppSettings({ ...appSettings, darkMode: !appSettings.darkMode })
                      }>
                      {appSettings.darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
                    </IconButton>

                    <ConnectButton
                      showBalance={{ smallScreen: false, largeScreen: true }}
                      chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
                    />

                    {/* {!isWalletConnected ? (
                      <Button
                        variant="contained"
                        endIcon={<Wallet />}
                        onClick={() => {
                          //connectWallet();
                        }}
                        sx={{ width: 155 }}>
                        Connect
                      </Button>
                    ) : (
                      <Chip
                        label={
                          userAdressENS ? userAdressENS : shortenWalletAddressLabel(userAddress)
                        }
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
                          fontWeight: 'bold',
                          justifyContent: 'space-around'
                        }}
                        deleteIcon={<PowerSettingsNew />}
                        onDelete={() => {
                          disconnectWallet();
                        }}
                      />
                    )} */}
                  </Stack>
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
