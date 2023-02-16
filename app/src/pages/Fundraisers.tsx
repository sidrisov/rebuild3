import { useContext, useState } from 'react';

import {
  AvatarGroup,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { ethers } from 'ethers';

import { Add, ContentCopy, FilterList, OpenInFull } from '@mui/icons-material';

import { UserContext } from '../contexts/UserContext';
import { shortenWalletAddressLabel } from '../utils/address';
import { green } from '@mui/material/colors';

import { useSnackbar } from 'notistack';
import { copyToClipboard } from '../utils/copyToClipboard';
import AddressAvatar from '../components/AddressAvatar';
import { CampaignStatusIndicator } from '../components/CampaignStatusIcon';
import CampaignFiltersDialog from '../modals/CampaignFiltersDialog';
import CampaignViewDialog from '../modals/CampaignViewDialog';
import DonateButton from '../buttons/DonateButton';
import CampaignDonationDialog from '../modals/CampaignDonationDialog';
import CampaignNewDialog from '../modals/CampaignNewDialog';
import filterCampaigns from '../utils/filterCampaigns';
import { Helmet } from 'react-helmet-async';

export default function Fundraisers() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openCampaignFilters, setOpenCampaignFilters] = useState(false);
  const [openCampaignDonation, setOpenCampaignDonation] = useState(false);
  const [openCampaignCreate, setOpenCampaignCreate] = useState(false);
  const [openCampaignView, setOpenCampaignView] = useState(false);
  const [campaignId, setCampaignId] = useState<number>(-1);

  const { isWalletConnected, userAddress, campaigns, campaignFilters } = useContext(UserContext);

  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <Helmet>
        <title> ReBuild3 | Fundraisers </title>
      </Helmet>
      <Box mt={3} display="flex" flexDirection="column">
        <Stack
          sx={{
            m: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setOpenCampaignFilters(true)}
            endIcon={<FilterList />}>
            Filters
          </Button>
          {isWalletConnected && (
            <Button
              size="small"
              variant="text"
              endIcon={<Add />}
              onClick={() => {
                setOpenCampaignCreate(true);
              }}>
              New
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'space-evenly',
            mt: 3,
            p: 1
          }}>
          {campaigns
            .filter((campaign) => filterCampaigns(campaign, campaignFilters, userAddress))
            .map((campaign, campaignId) => (
              <Tooltip key={`campaign_tooltip_${campaignId}`} title={campaign.description}>
                <Card
                  key={`campaigns_${campaignId}`}
                  elevation={1}
                  sx={{
                    maxWidth: smallScreen ? 1 : 500,
                    m: 1,
                    p: 2,
                    border: 2,
                    borderRadius: 3,
                    borderStyle: 'double',
                    borderColor: 'divider',
                    '&:hover': {
                      borderStyle: 'dashed',
                      boxShadow: 10
                    }
                  }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                        <AddressAvatar address={campaign.owner} />
                        <Box sx={{ ml: 0.5 }}>
                          <Stack direction="row" alignItems="center">
                            <Typography variant="body1">
                              {shortenWalletAddressLabel(campaign.owner)}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                copyToClipboard(campaign.owner);
                                enqueueSnackbar('Wallet address is copied to clipboard!');
                              }}>
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Typography
                            variant="subtitle2"
                            color={
                              campaign.raised.toBigInt() >= campaign.goal.toBigInt()
                                ? green[400]
                                : 'gray'
                            }>
                            {ethers.utils.formatEther(campaign.raised.toString()) +
                              '/' +
                              ethers.utils.formatEther(campaign.goal.toString()) +
                              ' ETH'}
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="Expand in fullsreen">
                        <IconButton
                          size="medium"
                          onClick={() => {
                            setCampaignId(campaignId);
                            setOpenCampaignView(true);
                          }}
                          sx={{ mt: -1, mr: -1 }}>
                          <OpenInFull fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center">
                      <Box>
                        <Typography variant="h6">{campaign.title}</Typography>
                        <Typography variant="body2" color="grey">{`${campaign.region}`}</Typography>
                      </Box>
                      <CampaignStatusIndicator
                        active={campaign.active}
                        released={campaign.released}
                      />
                    </Box>
                    <CardMedia
                      component="img"
                      image={campaign.cid}
                      loading="lazy"
                      sx={{
                        border: 1,
                        borderRadius: 3,
                        borderColor: 'divider'
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                      <Box p={0.5} display="flex" flexDirection="row">
                        {campaign.active && (
                          <>
                            <AvatarGroup
                              max={3}
                              total={campaign.donated.toNumber()}
                              sx={{
                                '& .MuiAvatar-root': { width: 15, height: 15, fontSize: 10 }
                              }}>
                              {[...Array(Math.min(2, campaign.donated.toNumber()))].map(
                                (item, i) => (
                                  <AddressAvatar
                                    key={`${campaignId}_${i}`}
                                    // TODO: fetch real address
                                    address={`${campaignId}_${i}`}
                                  />
                                )
                              )}
                            </AvatarGroup>
                            <Typography variant="body2" color="grey">
                              donated by
                            </Typography>
                          </>
                        )}
                      </Box>
                      {isWalletConnected && campaign.active && !campaign.released && (
                        <DonateButton
                          onClick={() => {
                            setCampaignId(campaignId);
                            setOpenCampaignDonation(true);
                          }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Card>
              </Tooltip>
            ))}
        </Box>
        <CampaignFiltersDialog
          open={openCampaignFilters}
          onClose={() => setOpenCampaignFilters(false)}
        />
        <CampaignNewDialog
          open={openCampaignCreate}
          closeStateCallback={() => setOpenCampaignCreate(false)}
        />
        <CampaignViewDialog
          campaignId={campaignId}
          open={openCampaignView}
          closeStateCallback={() => {
            setOpenCampaignView(false);
            setCampaignId(-1);
          }}
        />
        <CampaignDonationDialog
          open={openCampaignDonation}
          closeStateCallback={() => {
            setOpenCampaignDonation(false);
            setCampaignId(-1);
          }}
          campaignId={campaignId}
        />
      </Box>
    </>
  );
}
