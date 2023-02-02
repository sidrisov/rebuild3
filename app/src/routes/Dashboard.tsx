import { useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import { Box, Typography } from '@mui/material';

import { UserContext } from '../contexts/UserContext';
import { DashboardStatsType } from '../types/DashboardStatsType';
import { StatsCard } from '../components/StatsCard';

export default function Dashboard() {
  const { isWalletConnected, regions, organizations, contract } = useContext(UserContext);
  const [stats, setStats] = useState<DashboardStatsType>({} as DashboardStatsType);

  useMemo(async () => {
    if (isWalletConnected) {
      const thresholdWei = await contract?.goalThreshold();

      let threshold;
      if (thresholdWei) {
        threshold = ethers.utils.formatEther(thresholdWei);
      }
      setStats({
        activeRegions: (await contract?.getActiveRegions())?.length,
        organizations: (await contract?.getAllOrganizations())?.length,
        campaigns: (await contract?.getAllCampaigns())?.length,
        threshold
      });
    }
  }, [isWalletConnected, contract]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        overflowWrap: 'break-word',
        alignContent: 'center',
        justifyContent: 'space-evenly',
        p: 1,
        m: 1
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
  );
}
