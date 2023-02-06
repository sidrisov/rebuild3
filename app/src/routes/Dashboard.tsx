import { useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import { Box, Typography } from '@mui/material';

import { UserContext } from '../contexts/UserContext';
import { DashboardStatsType } from '../types/DashboardStatsType';
import { StatsCard } from '../components/StatsCard';

export default function Dashboard() {
  const { regions, organizations, campaigns, threshold } = useContext(UserContext);
  const [stats, setStats] = useState<DashboardStatsType>({} as DashboardStatsType);

  useMemo(async () => {
    setStats({
      activeRegions: regions.length,
      organizations: organizations.length,
      campaigns: campaigns.length,
      threshold
    });
  }, [regions, organizations, campaigns]);

  return (
    <Box>
      <Typography variant="h4" m={3}>
        Welcome to ReBuild3
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflowWrap: 'break-word',
          alignContent: 'center',
          justifyContent: 'space-evenly',
          p: 1,
          mt: 5
        }}>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Active Regions:
          </Typography>
          <Typography variant="h6">{stats.activeRegions}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Organizations:
          </Typography>
          <Typography variant="h6">{stats.organizations}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Campaigns:
          </Typography>
          <Typography variant="h6">{stats.campaigns}</Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="overline" color="grey">
            Goal Threashold:
          </Typography>
          <Typography variant="h6">{stats.threshold} ETH</Typography>
        </StatsCard>
      </Box>
    </Box>
  );
}
