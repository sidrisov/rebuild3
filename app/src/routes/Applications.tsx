import { useContext, useState } from 'react';

import {
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

import AddIcon from '@mui/icons-material/Add';

import { UserContext } from '../layouts/App';
import { grey } from '@mui/material/colors';
import AddressAvatar from '../components/AddressAvatar';
import { shortenWalletAddressLabel } from '../utils';

function Applications() {
  const [open, setOpen] = useState(false);
  const { isWalletConnected, regions, organizations, contract, campaigns } =
    useContext(UserContext);

  function handleClickOpenApplicationDialog(): void {
    setOpen(true);
  }

  function handleCloseApplicationDialog(): void {
    setOpen(false);
  }

  async function submitCampaign() {
    const title = (window.document.getElementById('title') as HTMLInputElement).value;
    const description = (window.document.getElementById('description') as HTMLInputElement).value;
    const goal = ethers.utils.parseEther(
      (document.getElementById('eth') as HTMLInputElement).value
    );
    const region = (document.getElementById('region') as HTMLInputElement).value;
    const org = (document.getElementById('org') as HTMLInputElement).value;

    await contract?.deactivateOrganization(organizations[1].account);

    await (await contract?.submitCampaign(title, description, goal, region, org))?.wait();
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
            startIcon={<AddIcon />}
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
        {campaigns.map((campaign) => (
          <Card
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
                  <AddressAvatar size={40} name={campaign.recipient}></AddressAvatar>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body1">
                      {shortenWalletAddressLabel(campaign.recipient)}
                    </Typography>
                    <Typography variant="caption" color="gray">
                      {ethers.utils.formatEther(campaign.fundsRaised.toString()) +
                        '/' +
                        ethers.utils.formatEther(campaign.goal.toString()) +
                        ' ETH'}
                    </Typography>
                  </Box>
                </Box>
                <Button>Donate</Button>
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
                <Badge
                  badgeContent
                  variant="dot"
                  color={campaign.active ? 'success' : 'warning'}
                  sx={{
                    alignSelf: 'center',
                    justifySelf: 'center'
                  }}
                />
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
            <TextField
              select
              variant="standard"
              label="Region"
              id="region"
              SelectProps={{
                native: true
              }}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </TextField>
            <TextField
              select
              variant="standard"
              label="Organization"
              id="org"
              SelectProps={{
                native: true
              }}>
              {organizations.map((org) => (
                <option key={org.name} value={org.account}>
                  {org.name}
                </option>
              ))}
            </TextField>

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

export default Applications;
