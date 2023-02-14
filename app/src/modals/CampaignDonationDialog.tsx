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

export type CampaignDonationDialogProps = DialogProps & {
  campaignid: number;
};

export default function CampaignDonationDialog(props: CampaignDonationDialogProps) {
  const { contract } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // TODO: little hack, any better way to close itsef within dialog?
  async function closeDialog() {
    if (props.onClose) {
      props.onClose({}, 'escapeKeyDown');
    }
  }
  async function handleDonation(campaignId: number) {
    if (campaignId !== -1) {
      console.log('Im here');
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
    <Dialog {...props}>
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
            closeDialog();
          }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            setLoading(true);
            handleDonation(props.campaignid)
              .then(() => {
                setLoading(false);
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  closeDialog();
                }, showSuccessTimeMs);
              })
              .catch((reason) => {
                closeDialog();
                enqueueSnackbar(`Failed to donate!\n${reason}`, { variant: 'error' });
              });
          }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
