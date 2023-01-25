import { SvgIcon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/cubes.svg';

function HomeLogo(props: any) {
  return (
    <Box {...props} sx={{ textDecoration: 'none' }} component={Link} to={'/'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <SvgIcon>
          <Logo />
        </SvgIcon>
        <Typography color="primary" variant="h6">
          ReBuild3
        </Typography>
      </Box>
    </Box>
  );
}

export default HomeLogo;
