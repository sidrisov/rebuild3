import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  InputAdornment,
  TextField
} from '@mui/material';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import {
  LoadingProgress,
  showSuccessTimeMs,
  SuccessIndicator
} from '../components/ProgressIndicators';
import { CloseCallbackType } from '../types/CloseCallbackType';

export type CampaignDonationDialogProps = DialogProps &
  CloseCallbackType & {
    campaignId: number;
  };

export default function CampaignDonationDialog({
  campaignId,
  closeStateCallback,
  ...props
}: CampaignDonationDialogProps) {
  const { contract } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function onCloseDialog() {
    closeStateCallback();
  }
  async function handleDonation(campaignId: number) {
    if (campaignId !== -1) {
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

  return (
    <Dialog {...props} onClose={onCloseDialog}>
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
            onCloseDialog();
          }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            setLoading(true);
            handleDonation(campaignId)
              .then(() => {
                setLoading(false);
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  onCloseDialog();
                }, showSuccessTimeMs);
              })
              .catch((reason) => {
                onCloseDialog();
                enqueueSnackbar(`Failed to donate!\n${reason}`, { variant: 'error' });
              });
          }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
