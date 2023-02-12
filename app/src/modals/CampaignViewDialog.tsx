import { ContentCopy } from '@mui/icons-material';
import {
  Box,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import { blue, green } from '@mui/material/colors';
import { TransitionProps } from '@mui/material/transitions';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { forwardRef, useContext, useMemo, useState } from 'react';
import AddressAvatar from '../components/AddressAvatar';
import { CampaignStatusIndicator } from '../components/CampaignStatusIcon';
import { UserContext } from '../contexts/UserContext';
import { shortenWalletAddressLabel } from '../utils/address';
import { copyToClipboard } from '../utils/copyToClipboard';
import ApproveButton from '../buttons/ApproveButton';
import DonateButton from '../buttons/DonateButton';
import ReleaseButton from '../buttons/ReleaseButton';
import CampaignDonationDialog from './CampaignDonationDialog';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { Utils } from 'alchemy-sdk';

export type CampaignDialogProps = DialogProps & {
  campaignid: number;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} style={{ transitionDelay: '100ms' }} />;
});

export default function CampaignViewDialog(props: CampaignDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isWalletConnected, userAddress, campaigns, contract } = useContext(UserContext);
  const [campaign, setCampaign] = useState<ReBuild3.CampaignStructOutput>();
  const { enqueueSnackbar } = useSnackbar();
  const [openCampaignDonation, setOpenCampaignDonation] = useState(false);
  const [donations, setDonations] = useState<ReBuild3.DonationStructOutput[] | undefined>([]);

  const [campaignProgress, setCampaignProgress] = useState(0);

  const campaignId = props.campaignid;

  async function handleApproveCampaign(campaignId: number) {
    await (await contract?.approveCampaign(campaignId))?.wait();
  }

  useMemo(async () => {
    if (campaignId !== -1) {
      setDonations(await contract?.getCampaignDonations(campaignId));

      const currentCampaign = campaigns[campaignId];

      const raised = ethers.utils.formatEther(currentCampaign.raised.toString());
      const goal = ethers.utils.formatEther(currentCampaign.goal.toString());

      const currentProgress = (Number(raised) / Number(goal)) * 100;

      // linear progress value is of range [0, 100], normalize
      setCampaignProgress(currentProgress > 100 ? 100 : currentProgress);
      setCampaign(campaigns[campaignId]);
    }
  }, [campaignId, campaigns]);

  async function handleReleaseCampaign(campaignId: number) {
    // TODO: rename => releaseCampaign or releaseFunds
    await (await contract?.release(campaignId))?.wait();
  }

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
    }
  }));

  if (campaign) {
    return (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          fullScreen={fullScreen}
          TransitionComponent={Transition}
          {...props}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <DialogTitle fontSize={20}>{campaign.title}</DialogTitle>
            <Box pr={2}>
              <CampaignStatusIndicator
                fontSize="large"
                active={campaign.active}
                released={campaign.released}
              />
            </Box>
          </Box>
          <DialogContent dividers>
            <DialogContentText fontSize={18}>{campaign.description}</DialogContentText>
            <Card
              elevation={1}
              sx={{
                my: 1,
                p: 1.5,
                border: 2,
                borderRadius: 3,
                borderStyle: 'double',
                borderColor: 'divider'
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <Stack spacing={0.5} direction="row" alignItems="center">
                  <AddressAvatar address={campaign.owner} />
                  <Typography variant="subtitle1">
                    {smallScreen ? shortenWalletAddressLabel(campaign.owner) : campaign.owner}
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
                <Typography variant="body1" color="grey">{`${campaign.region}`}</Typography>
              </Box>
              <Stack p={0.5} spacing={0.5} direction="row" alignItems="center">
                <BorderLinearProgress
                  variant="determinate"
                  value={campaignProgress}
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="subtitle2">
                  {ethers.utils.formatEther(campaign.raised.toString())}/
                  {ethers.utils.formatEther(campaign.goal.toString())} ETH
                </Typography>
              </Stack>
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
            </Card>

            <Paper
              elevation={1}
              sx={{
                my: 1,
                p: 1.5,
                border: 2,
                borderRadius: 3,
                borderStyle: 'double',
                borderColor: 'divider'
              }}>
              <Toolbar>
                <Typography fontSize={18}>Donations ({donations?.length})</Typography>
              </Toolbar>
              <TableContainer sx={{ minHeight: 50, maxHeight: 250 }}>
                <Table stickyHeader padding={smallScreen ? 'checkbox' : 'normal'}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Address</TableCell>
                      <TableCell align="center">Amount (ETH)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donations &&
                      donations.map((e, i) => (
                        <TableRow
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{i + 1}</TableCell>
                          <TableCell align="center">
                            <Stack spacing={0.5} direction="row" alignItems="center">
                              <AddressAvatar
                                sx={{ width: smallScreen ? 24 : 36, height: smallScreen ? 24 : 36 }}
                                address={donations[i].donor}
                              />
                              <Typography>
                                {smallScreen
                                  ? shortenWalletAddressLabel(donations[i].donor)
                                  : donations[i].donor}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  copyToClipboard(donations[i].donor);
                                  enqueueSnackbar('Wallet address is copied to clipboard!');
                                }}>
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            {parseFloat(Utils.formatUnits(donations[i].amount)).toFixed(3)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ px: 3, justifyContent: 'space-between' }}>
            <Box>
              {campaign.organization === userAddress && !campaign.active && (
                <ApproveButton
                  onClick={() => {
                    handleApproveCampaign(campaignId);
                  }}
                />
              )}

              {campaign.organization === userAddress &&
                campaign.active &&
                !campaign.released &&
                campaign.raised.toBigInt() >= campaign.goal.toBigInt() && (
                  <ReleaseButton
                    variant="text"
                    size="small"
                    sx={{ p: 1, color: blue[400] }}
                    onClick={() => {
                      handleReleaseCampaign(campaignId);
                    }}
                  />
                )}
            </Box>

            {isWalletConnected && campaign.active && !campaign.released && (
              <DonateButton
                onClick={() => {
                  setOpenCampaignDonation(true);
                }}
              />
            )}
          </DialogActions>
        </Dialog>
        <CampaignDonationDialog
          open={openCampaignDonation}
          onClose={() => setOpenCampaignDonation(false)}
          campaignid={campaignId}
        />
      </>
    );
  } else {
    return <></>;
  }
}
