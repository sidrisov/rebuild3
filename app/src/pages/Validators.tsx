import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { shortenWalletAddressLabel } from '../utils/address';

import { Badge, Box, Card, Chip, Typography, Tooltip, Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from '../utils/copyToClipboard';
import { useSnackbar } from 'notistack';
import AddressAvatar from '../components/AddressAvatar';

export default function Validators() {
  const { organizations } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box mt={3} display="flex" flexDirection="column">
      <Typography align="center" color="primary" variant="h6" m={1}>
        Validators
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          p: 1,
          mt: 3
        }}>
        {organizations.map((organization, i) => (
          <Tooltip
            key={`validators_tooltip_${i}`}
            title={organization.description}
            followCursor={true}>
            <Card
              key={`validators_${i}`}
              elevation={1}
              sx={{
                width: 300,
                m: 1,
                border: 2,
                borderRadius: 5,
                borderStyle: 'double',
                borderColor: 'divider',
                '&:hover': {
                  borderStyle: 'dashed',
                  boxShadow: 10
                }
              }}>
              <Stack spacing={1} direction="column" m={1} p={1}>
                <Badge
                  variant="dot"
                  color={organization.active ? 'success' : 'error'}
                  sx={{
                    alignSelf: 'flex-end'
                  }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Chip
                    label={shortenWalletAddressLabel(organization.account)}
                    avatar={<AddressAvatar address={organization.account} />}
                    deleteIcon={<ContentCopy fontSize="inherit" />}
                    onDelete={() => {
                      copyToClipboard(organization.account);
                      enqueueSnackbar('Wallet address is copied to clipboard!');
                    }}
                    sx={{
                      height: 40,
                      width: 150,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography fontSize={12} color="grey">
                    {organization.region}
                  </Typography>
                </Box>
                <Typography fontSize={16}>{organization.name}</Typography>
              </Stack>
            </Card>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
