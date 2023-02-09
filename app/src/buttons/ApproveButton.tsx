import { AddTask } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { blue } from '@mui/material/colors';

export default function ApproveButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="text"
      size="small"
      sx={{ p: 1, color: blue[400] }}
      endIcon={<AddTask />}>
      Approve
    </Button>
  );
}
