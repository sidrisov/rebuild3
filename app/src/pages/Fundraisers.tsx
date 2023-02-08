import { useContext, useState } from 'react';

import {
  Autocomplete,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { ethers } from 'ethers';

import {
  Add,
  AttachFile,
  CheckCircle,
  ContentCopy,
  FilterList,
  OpenInFull,
  VolunteerActivism
} from '@mui/icons-material';

import { UserContext } from '../contexts/UserContext';
import { shortenWalletAddressLabel } from '../utils/address';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { green, red } from '@mui/material/colors';

import { uploadToIpfs } from '../utils/ipfs';
import { useSnackbar } from 'notistack';
import { copyToClipboard } from '../utils/copyToClipboard';
import { Region } from '../types/CampaignFiltersType';
import AddressAvatar from '../components/AddressAvatar';
import { CampaignStatusIcon } from '../components/CampaignStatusIcon';
import CampaignFiltersDialog from '../modals/CampaignFiltersDialog';
import CampaignViewDialog from '../modals/CampaignViewDialog';

const LoadingProgress = <CircularProgress size={30} thickness={5} color="warning" sx={{ m: 2 }} />;
const SuccessIndicator = <CheckCircle fontSize="large" color="success" sx={{ m: 2 }} />;

const showSuccessTimeMs = 1000;

export default function Fundraisers() {
  const [openCampaignFilters, setOpenCampaignFilters] = useState(false);
  const [openCampaignDonation, setOpenCampaignDonation] = useState(false);
  const [openCampaignCreate, setOpenCampaignCreate] = useState(false);
  const [openCampaignView, setOpenCampaignView] = useState(false);
  const [campaignId, setCampaignId] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    isWalletConnected,
    userAddress,
    regions,
    organizations,
    contract,
    campaigns,
    campaignFilters
  } = useContext(UserContext);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedValidator, setSelectedValidator] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  function handleCloseCampaignDialog() {
    setOpenCampaignCreate(false);
    setSelectedImage(null);
    setSelectedRegion('');
    setSelectedValidator('');
  }

  function handleCloseDonationDialog() {
    setOpenCampaignDonation(false);
  }

  function handleOnRegionSelected(event: any, value: string | null) {
    if (value !== null) {
      setSelectedRegion(value);
    }
  }

  function handleOnValidatorSelected(event: any, value: ReBuild3.OrganizationStructOutput | null) {
    if (value !== null) {
      setSelectedValidator(value.account);
    }
  }

  function handleFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  }

  async function handleApproveCampaign(campaignId: number) {
    await (await contract?.approveCampaign(campaignId))?.wait();
  }

  async function handleReleaseCampaign(campaignId: number) {
    // TODO: rename => releaseCampaign or releaseFunds
    await (await contract?.release(campaignId))?.wait();
  }

  async function handleDonateToCampaign(campaignId: number | undefined) {
    if (campaignId) {
      const donation = ethers.utils.parseEther(
        (document.getElementById('eth-donation-amount') as HTMLInputElement).value
      );
      await (
        await contract?.donate(campaignId, {
          value: donation
        })
      )?.wait();
    }
  }

  async function submitCampaign() {
    const title = (window.document.getElementById('title') as HTMLInputElement).value;
    const description = (window.document.getElementById('description') as HTMLInputElement).value;
    const goal = ethers.utils.parseEther(
      (document.getElementById('eth') as HTMLInputElement).value
    );

    let cid = '';
    if (selectedImage !== null) {
      const result = await uploadToIpfs(selectedImage);
      if (result) {
        cid = result[0].path;
      }
    }

    if (cid === '') {
      enqueueSnackbar('Image upload to IPFS failed!', {
        variant: 'error'
      });
      return;
    } else {
      enqueueSnackbar('Successfully uploaded image to IPFS!', {
        variant: 'success'
      });
    }

    // TODO: for now save the whole path, ideally, we want to save only cid, and then load all files based on the metadata stored
    await (
      await contract?.submitCampaign(
        title,
        description,
        cid,
        goal,
        selectedRegion,
        selectedValidator
      )
    )?.wait();
  }

  function getCampaignStatusLabel(campaign: ReBuild3.CampaignStructOutput) {
    if (campaign.released) {
      return 'funded';
    } else if (!campaign.active) {
      return 'new';
    } else {
      return 'live';
    }
  }

  return (
    <Box mt={3} display="flex" flexDirection="column">
      <Stack
        sx={{ m: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
              setLoading(false);
              setShowSuccess(false);
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
          .filter((campaign) => {
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
          })
          .map((campaign, campaignId) => (
            <Card
              key={`campaigns_${campaignId}`}
              elevation={1}
              sx={{
                minWidth: '0.3',
                flexGrow: 1,
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
                  <IconButton
                    size="medium"
                    onClick={() => {
                      setCampaignId(campaignId);
                      setOpenCampaignView(true);
                    }}
                    sx={{ mt: -1, mr: -1 }}>
                    <OpenInFull fontSize="small" />
                  </IconButton>
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
                  <CampaignStatusIcon active={campaign.active} released={campaign.released} />
                </Box>
                <CardMedia
                  component="img"
                  width="200"
                  height="200"
                  image={campaign.cid}
                  loading="lazy"
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Box display="flex" flexDirection="row">
                    {campaign.active && (
                      <>
                        <AvatarGroup
                          max={3}
                          total={campaign.donated.toNumber()}
                          sx={{
                            '& .MuiAvatar-root': { width: 15, height: 15, fontSize: 10 }
                          }}>
                          {[...Array(Math.min(2, campaign.donated.toNumber()))].map((item, i) => (
                            <AddressAvatar
                              key={`${campaignId}_${i}`}
                              // TODO: fetch real address
                              address={`${campaignId}_${i}`}
                            />
                          ))}
                        </AvatarGroup>
                        <Typography variant="body2" color="grey">
                          donated by
                        </Typography>
                      </>
                    )}
                  </Box>
                  {isWalletConnected && campaign.active && !campaign.released && (
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: red[400] }}
                      onClick={() => {
                        setCampaignId(campaignId);
                        setOpenCampaignDonation(true);
                        setLoading(false);
                        setShowSuccess(false);
                      }}
                      endIcon={<VolunteerActivism />}>
                      Donate
                    </Button>
                  )}
                </Box>
              </Stack>
            </Card>
          ))}
      </Box>
      <Dialog fullScreen open={openCampaignCreate} onClose={handleCloseCampaignDialog}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle>New Campaign</DialogTitle>
          {loading && LoadingProgress}
          {showSuccess && SuccessIndicator}
        </Box>
        <DialogContent sx={{ m: 1 }}>
          <DialogContentText m={1}>
            Please, provide information on what you are raising funds, including images of what you
            want to rebuild:
          </DialogContentText>
          <Box
            component="form"
            id="application"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              '& > :not(style)': { m: 1 }
            }}>
            <TextField variant="outlined" label="Title" id="title" />
            <TextField
              variant="outlined"
              fullWidth
              minRows={3}
              multiline
              maxRows={10}
              label="Description"
              id="description"
            />
            {
              //TODO: clear input value for organization whenever region is changed
            }

            <Stack direction="row" spacing={2} width={1} justifyContent="start" alignItems="center">
              <Autocomplete
                sx={{ flexGrow: 1, maxWidth: 400 }}
                autoHighlight
                id="region"
                onChange={handleOnRegionSelected}
                options={regions}
                renderInput={(params) => (
                  <TextField variant="outlined" {...params} label="Region" sx={{ flexGrow: '1' }} />
                )}
              />
              <Autocomplete
                sx={{ flexGrow: 1, maxWidth: 400 }}
                autoHighlight
                id="org"
                getOptionLabel={(option) => option.name}
                onChange={handleOnValidatorSelected}
                options={organizations.filter((org) => {
                  return org.active && selectedRegion === org.region;
                })}
                renderInput={(params) => (
                  <TextField variant="outlined" {...params} label="Organization" />
                )}
              />
            </Stack>
            <TextField
              sx={{ flexGrow: 1, maxWidth: 400 }}
              variant="outlined"
              label="Goal"
              id="eth"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                inputMode: 'numeric'
                //pattern: '[0-9]*'
              }}
            />
            {selectedImage !== null && (
              <img width="95%" src={URL.createObjectURL(selectedImage)} loading="lazy" />
            )}
            <Stack
              width={1}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                wordBreak: 'break-all'
              }}>
              <Button
                size="small"
                variant="outlined"
                component="label"
                startIcon={<AttachFile />}
                sx={{ minWidth: 100 }}>
                Images
                <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
              </Button>
              <Typography maxWidth={0.8} variant="subtitle2" color="grey">
                {selectedImage !== null && selectedImage.name}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              setLoading(false);
              handleCloseCampaignDialog();
            }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              setLoading(true);
              submitCampaign()
                .then(() => {
                  setLoading(false);
                  setShowSuccess(true);
                  setTimeout(() => {
                    setShowSuccess(false);
                    handleCloseCampaignDialog();
                  }, showSuccessTimeMs);
                })
                .catch((reason) => {
                  handleCloseCampaignDialog();
                  enqueueSnackbar(`Failed to submit a campaign!\n${reason}`, {
                    variant: 'error'
                  });
                });
            }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <CampaignFiltersDialog
        open={openCampaignFilters}
        onClose={() => setOpenCampaignFilters(false)}
      />
      <CampaignViewDialog
        open={openCampaignView}
        onClose={() => setOpenCampaignView(false)}
        campaignid={campaignId}
      />

      <Dialog open={openCampaignDonation} onClose={() => setOpenCampaignDonation(false)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle>Donation</DialogTitle>
          {loading && LoadingProgress}
          {showSuccess && SuccessIndicator}
        </Box>
        <DialogContent>
          <DialogContentText>Choose amount to donate:</DialogContentText>
          <TextField
            variant="outlined"
            label="Amount"
            id="eth-donation-amount"
            type="number"
            sx={{ m: 1 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
              inputMode: 'numeric'
              //pattern: '[0-9]*'
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              setLoading(false);
              handleCloseDonationDialog();
            }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              setLoading(true);
              handleDonateToCampaign(campaignId)
                .then(() => {
                  setLoading(false);
                  setShowSuccess(true);
                  setTimeout(() => {
                    setShowSuccess(false);
                    handleCloseDonationDialog();
                  }, showSuccessTimeMs);
                })
                .catch((reason) => {
                  handleCloseDonationDialog();
                  enqueueSnackbar(`Failed to donate!\n${reason}`, { variant: 'error' });
                });
            }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
