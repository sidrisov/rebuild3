import { ExitToApp, VolunteerActivism } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { green } from '@mui/material/colors';

export default function ReleaseButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="text"
      size="small"
      sx={{ p: 1, color: green[400] }}
      endIcon={<ExitToApp />}>
      Release
    </Button>
  );
}
