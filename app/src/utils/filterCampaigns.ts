import { ReBuild3 } from '../../../solidity/typechain-types/contracts/ReBuild3';
import { CampaignFilters, Region } from '../types/CampaignFiltersType';

export default function filterCampaigns(
  campaign: ReBuild3.CampaignStructOutput,
  campaignFilters: CampaignFilters,
  userAddress: string | undefined
) {
  let result = false;
  if (campaignFilters.region === ('all' as Region)) {
    result = true;
  } else {
    result = campaignFilters.region === campaign.region;
  }

  if (!result) {
    return false;
  }

  switch (campaignFilters.user) {
    case 'all':
      result = true;
      break;
    case 'createdByMe':
      result = campaign.owner === userAddress;
      break;
    case 'assignedToMe':
      result = campaign.organization === userAddress;
      break;
    default:
      result = true;
  }

  if (!result) {
    return false;
  }

  switch (campaignFilters.status) {
    case 'all':
      result = true;
      break;
    case 'pending':
      result = !campaign.active;
      break;
    case 'live':
      result = campaign.active && !campaign.released;
      break;
    case 'funded':
      result = campaign.active && campaign.released;
      break;
    case 'rejected':
      // TODO: not supported
      result = false;
      break;
    default:
      result = true;
  }
  return result;
}
