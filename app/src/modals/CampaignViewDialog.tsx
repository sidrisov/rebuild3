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
  Paper,
  Stack,
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

  const campaignId = props.campaignid;

  async function handleApproveCampaign(campaignId: number) {
    await (await contract?.approveCampaign(campaignId))?.wait();
  }

  useMemo(async () => {
    if (campaignId !== -1) {
      setDonations(await contract?.getCampaignDonations(campaignId));
      setCampaign(campaigns[campaignId]);
    }
  }, [campaignId, campaigns]);

  async function handleReleaseCampaign(campaignId: number) {
    // TODO: rename => releaseCampaign or releaseFunds
    await (await contract?.release(campaignId))?.wait();
  }

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
                minWidth: '0.3',
                m: 1,
                p: 2,
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
                        campaign.raised.toBigInt() >= campaign.goal.toBigInt() ? green[400] : 'gray'
                      }>
                      {ethers.utils.formatEther(campaign.raised.toString()) +
                        '/' +
                        ethers.utils.formatEther(campaign.goal.toString()) +
                        ' ETH'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="grey">{`${campaign.region}`}</Typography>
              </Box>
              <CardMedia
                component="img"
                width="300"
                height="300"
                image={campaign.cid}
                loading="lazy"
              />
            </Card>
            <Paper
              elevation={1}
              sx={{
                m: 1,
                p: 2,
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
