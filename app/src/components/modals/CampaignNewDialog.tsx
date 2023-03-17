import { AttachFile } from '@mui/icons-material';
import {
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Stack,
  Autocomplete,
  InputAdornment,
  Button,
  Typography,
  DialogActions,
  useMediaQuery,
  useTheme,
  DialogProps
} from '@mui/material';
import { ethers } from 'ethers';

import { useContext, useState } from 'react';

import { ReBuild3 } from '../../../../solidity/typechain-types';

import { LoadingProgress, SuccessIndicator, showSuccessTimeMs } from '../ProgressIndicators';

import { UserContext } from '../../contexts/UserContext';
import { CloseCallbackType } from '../../types/CloseCallbackType';
import { uploadToIpfs } from '../../utils/ipfs';
import { toast } from 'react-toastify';

export type CampaignNewDialogProps = DialogProps & CloseCallbackType;

export default function CampaignNewDialog({
  closeStateCallback,
  ...props
}: CampaignNewDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedValidator, setSelectedValidator] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { regions, organizations, contract } = useContext(UserContext);

  function handleCloseCampaignDialog() {
    closeStateCallback();
    setSelectedImage(null);
    setSelectedRegion('');
    setSelectedValidator('');
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
      toast.error('Image upload to IPFS failed!');
      return;
    } else {
      toast.success('Successfully uploaded image to IPFS!');
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

  return (
    <Dialog fullScreen={fullScreen} onClose={handleCloseCampaignDialog} {...props}>
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
          onClick={() => {
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
                toast.error(`Failed to submit a campaign!\n${reason}`);
              });
          }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
