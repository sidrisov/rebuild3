import { Box, Button, Container, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

function Applications() {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Applications
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />}>
          New
        </Button>
      </Stack>
    </Container>
  );
}

export default Applications;
