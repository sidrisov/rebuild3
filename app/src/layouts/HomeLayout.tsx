import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Button,
  Card,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Stack
} from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import HomeLogo from '../components/Logo';

import { ReactComponent as Love } from '../assets/loving.svg';
import { ReactComponent as LoveInverted } from '../assets/loving_inverted.svg';
import { blue, green, red } from '@mui/material/colors';
import CustomThemeProvider from '../theme/CustomThemeProvider';

export default function HomeLayout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <CustomThemeProvider darkMode={darkMode}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <HomeLogo flexGrow={1} />
          <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
            {darkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
          <Button variant="contained" component={Link} to={'/app'}>
            Go To App
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Card sx={{ my: 10, border: 2, borderRadius: 16 }} variant="elevation">
          <Box
            sx={{
              m: 5,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
            <Stack sx={{ spacing: 2, flex: 1 }}>
              <Typography color="grey" variant="h5">
                DECENTRALIZED CROWDFUNDING SOLUTION
              </Typography>
              <Typography variant="h3">
                ReBuild3 helps global community to bring back what was destroyed
              </Typography>
              <Typography m="10" color="grey" variant="h6">
                enforced by smart contracts to bring transperancy into the fundraising process,
                safeguard donations, and validate the expenditure.
              </Typography>
            </Stack>
            {darkMode ? <LoveInverted width={350} /> : <Love width={350} />}
          </Box>
        </Card>
        <Box
          sx={{
            m: 5,
            display: 'flex',
            flexDirection: 'row',
            //flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Box sx={{ m: 2, spacing: 2, flexWrap: 'wrap' }}>
            <Typography color={red[400]} variant="h4">
              Submit
            </Typography>
            <Typography color="grey" variant="body1">
              Provide information on fundraising campaign.
            </Typography>
          </Box>
          <Box sx={{ m: 2, spacing: 2, flexWrap: 'wrap' }}>
            <Typography color={blue[400]} variant="h4">
              Release
            </Typography>
            <Typography color="grey" variant="body1">
              Validator confirms the details of campaign and releases the funds
            </Typography>
          </Box>
          <Box sx={{ m: 2, spacing: 2, flexWrap: 'wrap' }}>
            <Typography color={green[400]} variant="h4">
              Validate
            </Typography>
            <Typography color="grey" variant="body1">
              Validator check what was rebuilt.
            </Typography>
          </Box>
        </Box>
      </Container>
    </CustomThemeProvider>
  );
}
