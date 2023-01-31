import { BoxProps, SvgIcon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, LinkProps } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/cubes.svg';

export default function HomeLogo(props: any) {
  return (
    <Box
      {...props}
      component={Link}
      to="/"
      sx={{ textDecoration: 'none', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <SvgIcon>
        <Logo />
      </SvgIcon>
      <Typography ml={0.5} color="primary" variant="h6">
        ReBuild3
      </Typography>
    </Box>
  );
}
