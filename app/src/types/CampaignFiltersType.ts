export type ByUserType = 'all' | 'createdByMe' | 'assignedToMe';
export type CampaignStatus = 'all' | 'pending' | 'live' | 'funded' | 'rejected';
export type Region = 'all' | string;

export interface CampaignFilters {
  user: ByUserType;
  status: CampaignStatus;
  region: Region;
}
