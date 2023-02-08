import { Card, CardProps } from '@mui/material';

export function StatsCard(props: CardProps) {
  return (
    <Card
      {...props}
      sx={{
        maxWidth: '0.8',
        minWidth: '0.2',
        flexGrow: 1,
        m: 1,
        p: 2,
        border: 2,
        borderRadius: 3,
        borderStyle: 'double',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    />
  );
}
