import { ReactComponent as MetamaskFoxSvg } from '../assets/metamask.svg';
import { ReactComponent as MagicLinkSvg } from '../assets/magiclink.svg';
import AddressAvatar from './AddressAvatar';

export function WalletTypeAvatar(props: any) {
  switch (props.walletType) {
    case 'magic':
      return <MagicLinkSvg {...props} />;
    case 'metamask':
      return <MetamaskFoxSvg {...props} />;
    default:
      return <AddressAvatar {...props} />;
  }
}
