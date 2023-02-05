import { ethers } from 'ethers';
import { RB3Fundraising } from '../../../solidity/typechain-types';

export interface UserContextType {
  darkMode: boolean;
  isWalletConnected: boolean;
  userAddress: string;
  provider: ethers.providers.Web3Provider | ethers.providers.AlchemyProvider;
  regions: string[];
  organizations: RB3Fundraising.OrganizationStructOutput[];
  campaigns: RB3Fundraising.CampaignStructOutput[];
  contract: RB3Fundraising | undefined;
}
