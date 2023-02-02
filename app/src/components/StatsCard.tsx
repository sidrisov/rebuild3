import { Card, CardProps } from '@mui/material';

export function StatsCard(props: CardProps) {
  return (
    <Card
      {...props}
      sx={{
        maxWidth: '0.8',
        minWidth: '0.2',
        flexGrow: 1,
        m: 2,
        p: 2,
        border: 1,
        borderColor: 'gray',
        borderRadius: 1
      }}
    />
  );
}
