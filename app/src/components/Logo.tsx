import { SvgIcon, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/cubes.svg';

export default function HomeLogo(props: any) {
  return (
    <Box
      {...props}
      component={Link}
      to="/"
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      <SvgIcon>
        <Logo />
      </SvgIcon>
      <Typography ml={0.5} color="primary" variant="h6">
        ReBuild3
      </Typography>
      <Typography
        color={red[400]}
        sx={{
          ml: 1,
          p: 0.5,
          border: 2,
          borderRadius: 2,
          fontSize: 9,
          fontStyle: 'oblique',
          fontWeight: 'bold'
        }}>
        {import.meta.env.DEV ? import.meta.env.MODE : 'pre-alpha'}
      </Typography>
    </Box>
  );
}
