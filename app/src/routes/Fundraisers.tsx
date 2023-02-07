import { useContext, useState } from 'react';

import {
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { ethers } from 'ethers';

import { Add, AttachFile, ContentCopy, Done, DoneAll, FilterList } from '@mui/icons-material';

import { UserContext } from '../contexts/UserContext';
import AddressAvatar from '../components/AddressAvatar';
import { shortenWalletAddressLabel } from '../utils/address';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { green } from '@mui/material/colors';

import { uploadToIpfs } from '../utils/ipfs';
import { useSnackbar } from 'notistack';
import { copyToClipboard } from '../utils/copyToClipboard';
import { ByUserType, CampaignStatus, Region } from '../types/CampaignFiltersType';

export default function Fundraisers() {
  const [openNewCampaign, setOpenNewCampaign] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [openDonation, setOpenDonation] = useState(false);
  const [campaignId, setCampaingId] = useState<number | undefined>();

  const {
    isWalletConnected,
    userAddress,
    regions,
    organizations,
    contract,
    campaigns,
    campaignFilters,
    setCampaignFilters
  } = useContext(UserContext);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedValidator, setSelectedValidator] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  function handleCloseApplicationDialog() {
    setSelectedImage(null);
    setSelectedRegion('');
    setSelectedValidator('');
    setOpenNewCampaign(false);
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

  function CampaignStatusIcon(props: any) {
    return !props.released ? (
      <Done color={props.active ? 'success' : 'warning'} />
    ) : (
      <DoneAll color="success" />
    );
  }

  return (
    <>
      <Stack
        sx={{ m: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/*         <Typography variant="h4" gutterBottom>
          Campaigns
        </Typography> */}

        <Button
          variant="text"
          size="small"
          onClick={() => setOpenFilters(true)}
          endIcon={<FilterList />}>
          Filters
        </Button>
        {isWalletConnected && (
          <Button
            size="small"
            variant="text"
            endIcon={<Add />}
            onClick={() => setOpenNewCampaign(true)}>
            New
          </Button>
        )}
      </Stack>

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
        {campaigns
          .filter((campaign) => {
            let result = false;

            if (campaignFilters.region === ('all' as Region)) {
              result = true;
            } else {
              console.log(campaignFilters.region);
              console.log(campaign.region);

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
              sx={{
                maxWidth: '0.8',
                minWidth: '0.3',
                flexGrow: 1,
                m: 1,
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 3,
                '&:hover': {
                  borderColor: 'text.secondary'
                }
              }}>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    <Avatar src={`https://cdn.stamp.fyi/avatar/${userAddress}`} />
                    <Box sx={{ ml: 1 }}>
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

                  {campaign.active && !campaign.released && (
                    <Button
                      onClick={() => {
                        setCampaingId(campaignId);
                        setOpenDonation(true);
                      }}>
                      Donate
                    </Button>
                  )}
                  {campaign.organization === userAddress && !campaign.active && (
                    <Button
                      onClick={() => {
                        handleApproveCampaign(campaignId);
                      }}>
                      Approve
                    </Button>
                  )}

                  {campaign.organization === userAddress &&
                    campaign.active &&
                    !campaign.released &&
                    campaign.raised.toBigInt() >= campaign.goal.toBigInt() && (
                      <Button
                        onClick={() => {
                          handleReleaseCampaign(campaignId);
                        }}>
                        Release
                      </Button>
                    )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Typography variant="h6">{campaign.title}</Typography>
                  <Typography variant="body2" color="grey">{`in ${campaign.region}`}</Typography>
                </Box>
                <CardMedia
                  component="img"
                  width="200"
                  height="200"
                  image={campaign.cid}
                  loading="lazy"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            <Avatar
                              key={`${campaignId}_${i}`}
                              // TODO: fetch real address
                              src={`https://cdn.stamp.fyi/avatar/${campaignId}_${i}}`}
                            />
                          ))}
                        </AvatarGroup>
                        <Typography variant="body2" color="grey">
                          donated by
                        </Typography>
                      </>
                    )}
                  </Box>
                  <CampaignStatusIcon active={campaign.active} released={campaign.released} />
                </Box>
              </Stack>
            </Card>
          ))}
      </Box>
      <Dialog fullScreen open={openNewCampaign} onClose={handleCloseApplicationDialog}>
        <DialogTitle>New Campaign</DialogTitle>
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
              <Button size="small" variant="outlined" component="label" startIcon={<AttachFile />}>
                Attach
                <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
              </Button>
              <Typography maxWidth={0.8} variant="subtitle2" color="grey">
                {selectedImage !== null && selectedImage.name}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleCloseApplicationDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              submitCampaign().then(() => {
                handleCloseApplicationDialog();
              });
            }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFilters} onClose={() => setOpenFilters(false)}>
        <DialogContent>
          <Stack spacing={1} direction="column">
            {isWalletConnected && (
              <FormControl>
                <FormLabel>User</FormLabel>
                <RadioGroup
                  value={campaignFilters.user}
                  onChange={(event, value) => {
                    setCampaignFilters({ ...campaignFilters, user: value as ByUserType });
                  }}>
                  <FormControlLabel value={'all' as ByUserType} control={<Radio />} label="All" />
                  <FormControlLabel
                    value={'createdByMe' as ByUserType}
                    control={<Radio />}
                    label="Created by me"
                  />
                  <FormControlLabel
                    value={'assignedToMe' as ByUserType}
                    control={<Radio />}
                    label="Assigned to me"
                  />
                </RadioGroup>
              </FormControl>
            )}

            {isWalletConnected && (
              <Divider
                orientation="horizontal"
                variant="middle"
                sx={{ border: 1, borderColor: 'divider', borderStyle: 'dashed' }}
              />
            )}

            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                value={campaignFilters.status}
                onChange={(event, value) => {
                  setCampaignFilters({ ...campaignFilters, status: value as CampaignStatus });
                }}>
                <FormControlLabel value={'all' as CampaignStatus} control={<Radio />} label="All" />
                <FormControlLabel
                  value={'pending' as CampaignStatus}
                  control={<Radio />}
                  label="Pending"
                />
                <FormControlLabel
                  value={'live' as CampaignStatus}
                  control={<Radio />}
                  label="Live"
                />
                <FormControlLabel
                  value={'funded' as CampaignStatus}
                  control={<Radio />}
                  label="Funded"
                />
                <FormControlLabel
                  value={'rejected' as CampaignStatus}
                  control={<Radio />}
                  label="Rejected"
                />
              </RadioGroup>
            </FormControl>

            <Divider
              orientation="horizontal"
              variant="middle"
              sx={{ border: 1, borderColor: 'divider', borderStyle: 'dashed' }}
            />
            <FormControl>
              <FormLabel>Region</FormLabel>
              <Select
                variant="standard"
                disableUnderline
                value={campaignFilters.region}
                onChange={(event) => {
                  setCampaignFilters({ ...campaignFilters, region: event.target.value as Region });
                }}
                sx={{
                  'label + &': {
                    marginTop: 1
                  }
                }}>
                <MenuItem value={'all' as Region}>All</MenuItem>

                {regions.map((region) => {
                  return (
                    <MenuItem key={`filter_region_item_${region}`} value={region}>
                      {region}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDonation} onClose={() => setOpenDonation(false)}>
        <DialogTitle>Donation</DialogTitle>
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
        <DialogActions>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => setOpenDonation(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              handleDonateToCampaign(campaignId).then(() => {
                setOpenDonation(false);
              });
            }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
