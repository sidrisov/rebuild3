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
  Avatar,
  Link as MuiLink,
  SvgIcon
} from '@mui/material';

import { ExitToApp, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { blue, green, red } from '@mui/material/colors';

import HomeLogo from '../components/Logo';
import HideOnScroll from '../components/HideOnScroll';
import { ReactComponent as Love } from '../assets/loving.svg';
import { ReactComponent as LoveInverted } from '../assets/loving_inverted.svg';
import CustomThemeProvider from '../theme/CustomThemeProvider';
import { TECH_STACK } from './techStack';
import Logo from '../components/Logo';

function randomCardBgcolor() {
  const number = Math.floor(Math.random() * 3) + 1;
  switch (number) {
    case 1:
      return red[400];
    case 2:
      return blue[400];
    case 3:
      return green[400];
  }
}

function TechUsedCard(props: any) {
  return (
    <Card
      component={MuiLink}
      href={props.href}
      underline="none"
      sx={{
        m: 5,
        p: 2,
        border: 2,
        borderRadius: 5,
        color: randomCardBgcolor(),
        '&:hover': {
          borderStyle: 'dashed'
        }
      }}>
      <Typography fontStyle="oblique" fontWeight="bold" fontSize={20}>
        {props.children}
      </Typography>
    </Card>
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
        <Card sx={{ my: 3, border: 2, borderRadius: 16 }} variant="elevation">
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

        <Typography mt={10} align="center" variant="h3">
          How it works
        </Typography>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center'
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

        <Box
          sx={{
            mt: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Typography variant="h4">Decentralized Governance</Typography>
          <Card
            component={MuiLink}
            href="https://www.tally.xyz/gov/rebuild3-pre-alpha-001"
            sx={{
              m: 5,
              p: 2,
              textDecoration: 'none',
              border: 2,
              borderRadius: 5,
              '&:hover': {
                borderStyle: 'dashed'
              }
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <SvgIcon>
                <Logo />
              </SvgIcon>
              <Typography ml={0.5} variant="h6" color="primary">
                ReBuild3 DAO
              </Typography>
            </Box>
          </Card>
        </Box>

        <Typography mt={10} align="center" variant="h5">
          Technology Stack
        </Typography>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center'
          }}>
          {TECH_STACK.map((tech) => (
            <TechUsedCard key={tech.name} href={tech.link}>
              {tech.name}
            </TechUsedCard>
          ))}
        </Box>

        <MuiLink
          my={2}
          display="flex"
          justifyContent="center"
          variant="body2"
          underline="hover"
          color="grey"
          href="https://github.com/sidrisov">
          Made by Sinaver
        </MuiLink>
      </Container>
    </CustomThemeProvider>
  );
}
