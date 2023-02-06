import { ethers } from 'ethers';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { CampaignFilters } from './CampaignFiltersType';

export interface UserContextType {
  darkMode: boolean;
  isWalletConnected: boolean;
  userAddress: string;
  provider: ethers.providers.Web3Provider | ethers.providers.AlchemyProvider;
  regions: string[];
  organizations: ReBuild3.OrganizationStructOutput[];
  campaigns: ReBuild3.CampaignStructOutput[];
  contract: ReBuild3 | undefined;
  campaignFilters: CampaignFilters;
  setCampaignFilters: React.Dispatch<React.SetStateAction<CampaignFilters>>;
}
