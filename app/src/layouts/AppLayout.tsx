import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppBar, Button, IconButton, Toolbar, Box, Container, Chip } from '@mui/material';

import CustomThemeProvider from '../theme/CustomThemeProvider';
import { Wallet, PowerSettingsNew, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import Nav from '../components/Navigation';

import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

import { ConnectExtension } from '@magic-ext/connect';

const magic = new Magic(import.meta.env.VITE_MAGIC_KEY, {
  network: 'goerli',
  locale: 'en_US',
  extensions: [new ConnectExtension()]
});

function AppLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [connected, setConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  magic.preload();
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);

  async function connectWallet() {
    //const accounts = await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    //if (accounts.length !== 0) {
    // setUserAddress(accounts[0]);

    setUserAddress(address);
    setConnected(true);
  }

  async function disconnectWallet() {
    await magic.connect.disconnect();

    setConnected(false);
  }
  return (
    <CustomThemeProvider darkMode={darkMode}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row'
        }}>
        <Nav />
        <Container>
          <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{ backdropFilter: 'blur(5px)' }}>
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
                {darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
              </IconButton>

              {!connected ? (
                <Button
                  variant="contained"
                  endIcon={<Wallet />}
                  onClick={() => {
                    connectWallet();
                  }}>
                  Connect
                </Button>
              ) : (
                <Chip
                  label={userAddress}
                  size="small"
                  variant="filled"
                  color="secondary"
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
            <Outlet />
          </Box>
        </Container>
      </Box>
    </CustomThemeProvider>
  );
}

export default AppLayout;
