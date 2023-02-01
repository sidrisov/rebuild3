import { useContext, useState } from 'react';

import {
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
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

import { UserContext } from '../layouts/App';
import AddressAvatar from '../components/AddressAvatar';
import { shortenWalletAddressLabel } from '../utils';
import { RB3Fundraising } from '../../../solidity/typechain-types';

function Fundraisers() {
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
    await (await contract?.donate(campaignId, { value: ethers.utils.parseEther('0.1') }))?.wait();
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
        {campaigns.map((campaign, i) => (
          <Card
            key={`campaigns_${i}`}
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
                    <Typography variant="caption" color="gray">
                      {ethers.utils.formatEther(campaign.fundsRaised.toString()) +
                        '/' +
                        ethers.utils.formatEther(campaign.goal.toString()) +
                        ' ETH'}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  onClick={() => {
                    handleDonateToCampaign(i);
                  }}>
                  Donate
                </Button>

                {campaign.organization === userAddress && !campaign.active && (
                  <Button
                    onClick={() => {
                      handleApproveCampaign(i);
                    }}>
                    Approve
                  </Button>
                )}

                {campaign.organization === userAddress &&
                  campaign.active &&
                  campaign.fundsRaised >= campaign.goal && (
                    <Button
                      onClick={() => {
                        handleReleaseCampaign(i);
                      }}>
                      Release
                    </Button>
                  )}
              </Box>
              <Typography variant="h6">{campaign.title}</Typography>
              <CardMedia
                component="img"
                width="200"
                height="200"
                image={`/borodyanka${Math.floor(Math.random() * 3) + 1}.jpg`}
                alt="Paella dish"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <AvatarGroup
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': { width: 15, height: 15, fontSize: 10 }
                    }}>
                    <Avatar>
                      <AddressAvatar name={'Remy Sharp'} />
                    </Avatar>
                    <Avatar>
                      <AddressAvatar name={'Travis Howard'} />
                    </Avatar>
                    <Avatar>
                      <AddressAvatar name={'Cindy Baker'} />
                    </Avatar>
                    <Avatar>
                      <AddressAvatar name={'Agnes Walker'} />
                    </Avatar>
                  </AvatarGroup>
                  <Typography variant="subtitle2" color="grey" alignSelf="start">
                    donated by
                  </Typography>
                </Box>
                {!campaign.released ? (
                  <Done color={campaign.active ? 'success' : 'warning'} />
                ) : (
                  <DoneAll color="success" />
                )}
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

export default Fundraisers;
