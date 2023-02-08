import { useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import { Box, Typography } from '@mui/material';

import { UserContext } from '../contexts/UserContext';
import { DashboardStatsType } from '../types/DashboardStatsType';
import { StatsCard } from '../components/StatsCard';

export default function Dashboard() {
  const { regions, organizations, campaigns, threshold } = useContext(UserContext);
  const [stats, setStats] = useState<DashboardStatsType>({} as DashboardStatsType);

  // TODO: ideally, we would like to keep track of stats directly in Smart Contract, instead of doing it here
  useMemo(async () => {
    setStats({
      activeRegions: regions.length,
      validators: organizations.length,
      totalCampaigns: campaigns.length,
      successCampaigns: campaigns.filter((campaign) => campaign.released).length,
      donationsCount: campaigns
        .map((campaign) => campaign.donated.toNumber())
        .reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        }, 0),
      donationsAmount: ethers.utils.formatEther(
        campaigns
          .map((campaign) => campaign.raised)
          .reduce((previousValue, currentValue) => {
            return previousValue.add(currentValue);
          }, ethers.BigNumber.from(0))
      ),
      threshold
    });
  }, [regions, organizations, campaigns]);

  return (
    <Box mt={3} display="flex" flexDirection="column">
      <Typography color="primary" align="center" variant="h6" m={1}>
        Welcome back, let's ReBuild3!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'space-evenly',
          p: 1,
          mt: 3
        }}>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Active Regions
          </Typography>
          <Typography variant="h6">{stats.activeRegions}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Validators
          </Typography>
          <Typography variant="h6">{stats.validators}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Total Campaigns
          </Typography>
          <Typography variant="h6">{stats.totalCampaigns}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Success Campaigns
          </Typography>
          <Typography variant="h6">{stats.successCampaigns}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Donations
          </Typography>
          <Typography variant="h6">{stats.donationsCount}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Amount Donated
          </Typography>
          <Typography variant="h6">{stats.donationsAmount?.toString()} ETH</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Goal Threashold
          </Typography>
          <Typography variant="h6">{stats.threshold} ETH</Typography>
        </StatsCard>
      </Box>
    </Box>
  );
}
