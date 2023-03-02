import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

import '@rainbow-me/rainbowkit/styles.css';
import merge from 'lodash.merge';

import {
  AvatarComponent,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  Theme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, optimismGoerli, baseGoerli, mainnet, zkSyncTestnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import AddressAvatar from '../components/AddressAvatar';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { AppSettings } from '../types/AppSettingsType';

const { chains, provider, webSocketProvider } = configureChains(
  [optimismGoerli, goerli, baseGoerli, mainnet, zkSyncTestnet],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'ReBuild3',
  chains
});

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <AddressAvatar
      address={address}
      scale={size < 30 ? 3 : 10}
      sx={{ width: size, height: size }}
    />
  );
};

const custLightTheme = lightTheme({ overlayBlur: 'small' });
const customDarkTheme = merge(darkTheme({ overlayBlur: 'small' }), {
  colors: {
    modalBackground: '#242424',
    connectButtonBackground: '#1e1e1e'
  }
} as Theme);

export default function AppWithProviders() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [appSettings, setAppSettings] = useState<AppSettings>({
    magicEnabled: false,
    autoConnect: import.meta.env.VITE_INIT_CONNECT === 'true',
    darkMode: prefersDarkMode
  });

  const wagmiClient = createClient({
    autoConnect: appSettings.autoConnect,
    connectors,
    provider,
    webSocketProvider
  });

  return (
    <HelmetProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          theme={appSettings.darkMode ? customDarkTheme : custLightTheme}
          avatar={CustomAvatar}
          modalSize="compact"
          chains={chains}
          initialChain={chains.find(
            (chain) => chain.network === import.meta.env.VITE_DEFAULT_NETWORK
          )}
          showRecentTransactions={true}>
          <SnackbarProvider maxSnack={3}>
            <App appSettings={appSettings} setAppSettings={setAppSettings} />
          </SnackbarProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </HelmetProvider>
  );
}
