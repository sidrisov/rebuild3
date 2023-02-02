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
  Stack,
  useMediaQuery,
  Slide,
  useScrollTrigger,
  Avatar
} from '@mui/material';

import { ExitToApp, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { blue, green, red } from '@mui/material/colors';

import HomeLogo from '../components/Logo';
import { ReactComponent as Love } from '../assets/loving.svg';
import { ReactComponent as LoveInverted } from '../assets/loving_inverted.svg';
import CustomThemeProvider from '../theme/CustomThemeProvider';

function HideOnScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HomeLayout() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  return (
    <CustomThemeProvider darkMode={darkMode}>
      <HideOnScroll>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{ backdropFilter: 'blur(5px)' }}>
          <Toolbar>
            <HomeLogo flexGrow={1} />
            <IconButton onClick={() => setDarkMode((darkMode) => !darkMode)}>
              {darkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
            <Button
              variant="contained"
              component={Link}
              to={'/app'}
              endIcon={<ExitToApp />}
              sx={{ width: 150 }}>
              Go To App
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Container>
        <Card sx={{ my: 5, border: 2, borderRadius: 16 }} variant="elevation">
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
                DECENTRALIZED FUNDRAISING SOLUTION
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

        <Typography m={5} align="center" variant="h3">
          How it works
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center',
            spacing: 100
          }}>
          <Stack m={3} width={300} spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: red[400] }}>1</Avatar>
            <Typography color={red[400]} variant="h4">
              Submit
            </Typography>
            <Typography color="grey" variant="body1">
              User initiates a new campaign
            </Typography>
          </Stack>
          <Stack m={3} width={300} spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: blue[400] }}>2</Avatar>
            <Typography color={blue[400]} variant="h4">
              Approve
            </Typography>
            <Typography color="grey" variant="body1">
              Validator opens it for donation
            </Typography>
          </Stack>
          <Stack m={3} width={300} spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: green[400] }}>3</Avatar>
            <Typography color={green[400]} variant="h4">
              Release
            </Typography>
            <Typography color="grey" variant="body1">
              Validator releases the funds
            </Typography>
          </Stack>
        </Box>
      </Container>
    </CustomThemeProvider>
  );
}
