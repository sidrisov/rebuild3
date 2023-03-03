import { ReactComponent as MetamaskFox } from '../assets/metamask.svg';
import { ReactComponent as MagicLink } from '../assets/magiclink.svg';
import { ReactComponent as WalletConnect } from '../assets/walletconnect.svg';
import { ReactComponent as Coinbase } from '../assets/coinbase.svg';
import AddressAvatar from './AddressAvatar';
import { WalletInfo } from '@magic-ext/connect';

export function WalletTypeAvatar(props: any) {
  switch (props.wallettype) {
    case 'magic':
      return <MagicLink {...props} />;
    case 'metamask':
      return <MetamaskFox {...props} />;
    case 'coinbase_wallet':
      return <Coinbase {...props} />;
    case 'wallet_connect':
      return <WalletConnect {...props} />;
    default:
      return <AddressAvatar {...props} />;
  }
}

export function WalletTypeName(walletType: WalletInfo['walletType'] | undefined) {
  switch (walletType) {
    case 'magic':
      return 'Magic Wallet';
    case 'metamask':
      return 'MetaMask Wallet';
    case 'coinbase_wallet':
      return 'Coinbase Wallet';
    case 'wallet_connect':
      return 'Wallet Connect';
    default:
      return 'Wallet';
  }
}
