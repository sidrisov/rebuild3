import { DoneAll, GppBad, GppGood, PendingActions } from '@mui/icons-material';

export function CampaignStatusIcon(props: { active: boolean; released: boolean }) {
  if (props.active && props.released) {
    return <DoneAll color="success" />;
  }

  if (props.active) {
    return <GppGood color="primary" />;
  }

  if (!props.active) {
    return <PendingActions color="warning" />;
  }

  return <GppBad color="error" />;
}
