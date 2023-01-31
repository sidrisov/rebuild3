import { createContext, useMemo, useState } from 'react';
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
  Stack
} from '@mui/material';

import CustomThemeProvider from '../theme/CustomThemeProvider';
import { Wallet, PowerSettingsNew, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import Nav from '../components/Navigation';

import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

import { ConnectExtension } from '@magic-ext/connect';
import { shortenWalletAddressLabel } from '../utils';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';

import Rebuild3ContractArtifact from '../../../solidity/artifacts/contracts/RB3Fundraising.sol/RB3Fundraising.json';
import { RB3Fundraising } from '../../../solidity/typechain-types';
import AddressAvatar from '../components/AddressAvatar';

const MAGIC_ENABLED = import.meta.env.VITE_MAGIC_ENABLED === 'true';

var magic: InstanceWithExtensions<SDKBase, ConnectExtension[]>;
var provider: ethers.providers.Web3Provider;

if (MAGIC_ENABLED) {
  magic = new Magic(import.meta.env.VITE_MAGIC_KEY, {
    network: 'goerli',
    locale: 'en_US',
    extensions: [new ConnectExtension()]
  });
  magic.preload();
  provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
} else {
  provider = new ethers.providers.Web3Provider(window.ethereum as any);
}

interface UserContextType {
  darkMode: boolean;
  isWalletConnected: boolean;
  provider: ethers.providers.Web3Provider;
  regions: string[];
  organizations: RB3Fundraising.OrganizationStructOutput[];
  campaigns: RB3Fundraising.CampaignStructOutput[];
  contract: RB3Fundraising | undefined;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export default function AppLayout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [rb3Contract, setRB3Contract] = useState<RB3Fundraising>();
  const [regions, setRegions] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<RB3Fundraising.OrganizationStructOutput[]>([]);
  const [campaigns, setCampaigns] = useState<RB3Fundraising.CampaignStructOutput[]>([]);

  async function connectWallet() {
    if (!MAGIC_ENABLED) {
      await provider.send('eth_requestAccounts', []);
    }

    const signer = provider.getSigner();

    setSigner(signer);
    const address = await signer.getAddress();

    const contract = new ethers.Contract(
      import.meta.env.VITE_REBUILD3_CONTRACT_ADDR,
      Rebuild3ContractArtifact.abi,
      signer
    ) as RB3Fundraising;

    setRB3Contract(contract);
    setUserAddress(address);
    setWalletConnected(true);
  }

  useMemo(async () => {
    // load all countries
    if (isWalletConnected && rb3Contract !== undefined) {
      const regions = await rb3Contract.getActiveRegions();
      setRegions(regions);
      const organizations = await rb3Contract.getAllOrganizations();
      setOrganizations(organizations);
      const campaigns = await rb3Contract.getAllCampaigns();
      setCampaigns(campaigns);
    }
  }, [isWalletConnected, rb3Contract]);

  async function disconnectWallet(): Promise<void> {
    if (MAGIC_ENABLED) {
      await magic.connect.disconnect();
    }

    setWalletConnected(false);
  }
  return (
    <CustomThemeProvider darkMode={darkMode}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}>
        <Nav />
        <Box flexGrow={1}>
          <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{ alignSelf: 'self-end', width: '100%', backdropFilter: 'blur(5px)' }}>
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
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
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              my: 5,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'row'
            }}>
            <UserContext.Provider
              value={{
                darkMode,
                isWalletConnected,
                provider,
                regions,
                organizations,
                contract: rb3Contract,
                campaigns
              }}>
              <Container>
                <Outlet />
              </Container>
            </UserContext.Provider>
          </Box>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
}
