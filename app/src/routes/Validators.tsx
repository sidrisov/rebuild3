import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { shortenWalletAddressLabel } from '../utils/address';

import { Badge, Box, Card, CardActionArea, Chip, Typography, Avatar } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { copyToClipboard } from '../utils/copyToClipboard';
import { useSnackbar } from 'notistack';
import AddressAvatar from '../components/AddressAvatar';

export default function Validators() {
  const { organizations } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box>
      <Typography variant="h4" m={3}>
        Validators
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          p: 1,
          mt: 6
        }}>
        {organizations.map((organization, i) => (
          <Card
            key={`validators_${i}`}
            sx={{
              m: 1,
              border: 1,
              borderRadius: 5,
              '&:hover': {
                borderStyle: 'dashed'
              }
            }}
            onClick={() => {
              alert('Description: ' + organization.description);
            }}
            variant="elevation">
            <CardActionArea>
              <Box
                sx={{
                  m: 2,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
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
                    width: 140,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                />
                <Typography variant="h6">{organization.name}</Typography>
                <Typography variant="body1" color="grey">
                  {organization.region}
                </Typography>
                <Badge
                  variant="dot"
                  color={organization.active ? 'success' : 'error'}
                  sx={{
                    alignSelf: 'flex-end'
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                />
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
