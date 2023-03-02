import { VolunteerActivism } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { red } from '@mui/material/colors';

export default function DonateButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="text"
      size="small"
      sx={{ p: 0.5, color: red[400] }}
      endIcon={<VolunteerActivism />}>
      Donate
    </Button>
  );
}
