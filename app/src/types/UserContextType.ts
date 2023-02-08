import { ethers } from 'ethers';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { AppSettings } from './AppSettingsType';
import { CampaignFilters } from './CampaignFiltersType';

export interface UserContextType {
  isWalletConnected: boolean;
  userAddress: string;
  provider: ethers.providers.Web3Provider | ethers.providers.AlchemyProvider | undefined;
  regions: string[];
  organizations: ReBuild3.OrganizationStructOutput[];
  campaigns: ReBuild3.CampaignStructOutput[];
  threshold: string;
  contract: ReBuild3 | undefined;
  campaignFilters: CampaignFilters;
  setCampaignFilters: React.Dispatch<React.SetStateAction<CampaignFilters>>;
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}
