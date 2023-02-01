import { useContext } from 'react';

import { Badge, Box, Card, Chip, Typography } from '@mui/material';

import { UserContext } from '../layouts/App';
import { shortenWalletAddressLabel } from '../utils';

import AddressAvatar from '../components/AddressAvatar';

export default function Validators() {
  const { organizations } = useContext(UserContext);

  return (
    <Box>
      <Typography variant="h4" m={5}>
        Validators
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          p: 1,
          m: 1
        }}>
        {organizations.map((organization, i) => (
          <Card
            key={`validators_${i}`}
            sx={{ m: 1, border: 1, borderRadius: 5 }}
            variant="elevation">
            <Box
              sx={{
                m: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Chip
                label={shortenWalletAddressLabel(organization.account)}
                onClick={() => {
                  alert('Description: ' + organization.description);
                }}
                icon={
                  <Box display="flex">
                    <AddressAvatar size={20} name={organization.account} />
                  </Box>
                }
                sx={{
                  height: 30,
                  width: 105,
                  fontSize: 10,
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
          </Card>
        ))}
      </Box>
    </Box>
  );
}
