import { ReactComponent as MetamaskFox } from '../assets/metamask.svg';
import { ReactComponent as MagicLink } from '../assets/magiclink.svg';
import { ReactComponent as WalletConnect } from '../assets/walletconnect.svg';
import { ReactComponent as Coinbase } from '../assets/coinbase.svg';
import AddressAvatar from './AddressAvatar';

export function WalletTypeAvatar(props: any) {
  switch (props.walletType) {
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
