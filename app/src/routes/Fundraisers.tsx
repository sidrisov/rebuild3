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
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { ethers } from 'ethers';

import { Add, Done, DoneAll } from '@mui/icons-material';

import { UserContext } from '../contexts/UserContext';
import AddressAvatar from '../components/AddressAvatar';
import { shortenWalletAddressLabel } from '../utils/address';
import { RB3Fundraising } from '../../../solidity/typechain-types';
import { green } from '@mui/material/colors';

export default function Fundraisers() {
  const [open, setOpen] = useState(false);
  const { isWalletConnected, userAddress, regions, organizations, contract, campaigns } =
    useContext(UserContext);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedValidator, setSelectedValidator] = useState('');

  function handleClickOpenApplicationDialog() {
    setOpen(true);
  }

  function handleCloseApplicationDialog() {
    setOpen(false);
  }

  function handleOnRegionSelected(event: any, value: string | null) {
    if (value !== null) {
      setSelectedRegion(value);
    }
  }

  function handleOnValidatorSelected(
    event: any,
    value: RB3Fundraising.OrganizationStructOutput | null
  ) {
    if (value !== null) {
      setSelectedValidator(value.account);
    }
  }

  async function handleApproveCampaign(campaignId: number) {
    await (await contract?.approveCampaign(campaignId))?.wait();
  }

  async function handleReleaseCampaign(campaignId: number) {
    // TODO: rename => releaseCampaign or releaseFunds
    await (await contract?.release(campaignId))?.wait();
  }

  async function handleDonateToCampaign(campaignId: number) {
    await (await contract?.donate(campaignId, { value: ethers.utils.parseEther('1') }))?.wait();
  }

  async function submitCampaign() {
    const title = (window.document.getElementById('title') as HTMLInputElement).value;
    const description = (window.document.getElementById('description') as HTMLInputElement).value;
    const goal = ethers.utils.parseEther(
      (document.getElementById('eth') as HTMLInputElement).value
    );

    await (
      await contract?.submitCampaign(title, description, goal, selectedRegion, selectedValidator)
    )?.wait();
  }

  function getCampaignStatusLabel(campaign: RB3Fundraising.CampaignStructOutput) {
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
        sx={{ m: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          Campaigns
        </Typography>

        {isWalletConnected && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            sx={{ mr: -2 }}
            onClick={handleClickOpenApplicationDialog}>
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
          m: 1
        }}>
        {campaigns.map((campaign, campaignId) => (
          <Card
            key={`campaigns_${campaignId}`}
            sx={{
              maxWidth: '0.8',
              minWidth: '0.3',
              flexGrow: 1,
              m: 2,
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
                  <AddressAvatar size={40} name={campaign.owner}></AddressAvatar>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1">
                      {shortenWalletAddressLabel(campaign.owner)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={campaign.raised >= campaign.goal ? green[400] : 'gray'}>
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
                      handleDonateToCampaign(campaignId);
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
                  campaign.raised >= campaign.goal && (
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
                image={`/borodyanka${Math.floor(Math.random() * 3) + 1}.jpg`}
                alt="Paella dish"
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
                          <Avatar key={`${campaignId}_${i}`}>
                            <AddressAvatar name={`${campaignId}_${i}`} />
                          </Avatar>
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
      <Dialog open={open} onClose={handleCloseApplicationDialog}>
        <DialogTitle>New Campaign</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To submit a new application please specify following fields:
          </DialogContentText>
          <Box
            component="form"
            id="application"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' }
            }}>
            <TextField variant="standard" label="Title" id="title" />
            <TextField
              variant="standard"
              fullWidth
              multiline
              maxRows={10}
              label="Description"
              id="description"
            />
            {
              //TODO: clear input value for organization whenever region is changed
            }
            <Autocomplete
              autoHighlight
              id="region"
              onChange={handleOnRegionSelected}
              options={regions}
              renderInput={(params) => <TextField variant="standard" {...params} label="Region" />}
            />
            <Autocomplete
              autoHighlight
              id="org"
              getOptionLabel={(option) => option.name}
              onChange={handleOnValidatorSelected}
              options={organizations.filter((org) => {
                return org.active && selectedRegion === org.region;
              })}
              renderInput={(params) => (
                <TextField variant="standard" {...params} label="Organization" />
              )}
            />
            <TextField
              variant="standard"
              label="Campaign Goal"
              id="eth"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                inputMode: 'numeric'
                //pattern: '[0-9]*'
              }}
            />
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
              submitCampaign();
              handleCloseApplicationDialog();
            }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
