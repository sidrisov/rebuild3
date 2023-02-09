import { CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export const showSuccessTimeMs = 1000;

export const LoadingProgress = (
  <CircularProgress size={30} thickness={5} color="warning" sx={{ m: 2 }} />
);
export const SuccessIndicator = <CheckCircle fontSize="large" color="success" sx={{ m: 2 }} />;
