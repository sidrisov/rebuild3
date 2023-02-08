import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  Typography
} from '@mui/material';

const MAGIC_SUPPORTED = import.meta.env.VITE_MAGIC_SUPPORTED === 'true';
export default function Settings() {
  const { appSettings, setAppSettings } = useContext(UserContext);

  return (
    <Box mt={3} display="flex" flexDirection="column">
      <Typography align="center" color="primary" variant="h6" m={1}>
        Settings
      </Typography>
      <Box
        sx={{
          alignSelf: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          p: 1,
          mt: 3
        }}>
        <FormControl sx={{ p: 1 }}>
          <FormLabel>Wallet Connection</FormLabel>
          <FormGroup sx={{ m: 1 }}>
            <FormControlLabel
              disabled={!MAGIC_SUPPORTED}
              control={
                <Switch
                  checked={appSettings.magicEnabled}
                  onChange={() => {
                    setAppSettings({
                      ...appSettings,
                      magicEnabled: !appSettings.magicEnabled
                    });
                  }}
                />
              }
              label="Magic connect"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={appSettings.connectOnDemand}
                  onChange={() => {
                    setAppSettings({
                      ...appSettings,
                      connectOnDemand: !appSettings.connectOnDemand
                    });
                  }}
                />
              }
              label="On demand"
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
