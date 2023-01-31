import { useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import { Box, Card, CardProps, Container, Typography } from '@mui/material';

import { UserContext } from '../layouts/App';

interface DashboardStatsType {
  activeRegions: number | undefined;
  organizations: number | undefined;
  campaigns: number | undefined;
  threshold: string | undefined;
}

function StatsCard(props: CardProps) {
  return (
    <Card
      {...props}
      sx={{
        maxWidth: '0.8',
        minWidth: '0.2',
        flexGrow: 1,
        m: 2,
        p: 2,
        border: 1,
        borderColor: 'gray',
        borderRadius: 1
      }}
    />
  );
}

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
