import { DoneAll, GppBad, GppGood, PendingActions } from '@mui/icons-material';
import { Icon, IconProps, Tooltip } from '@mui/material';

export function CampaignStatusIndicator(props: {
  active: boolean;
  released: boolean;
  fontSize?: IconProps['fontSize'];
}) {
  if (props.active && props.released) {
    return (
      <Tooltip title="Successful campaign">
        <Icon fontSize={props.fontSize}>
          <DoneAll fontSize="inherit" color="success" />;
        </Icon>
      </Tooltip>
    );
  }

  if (props.active) {
    return (
      <Tooltip title="Validated campaign, open for donations">
        <Icon fontSize={props.fontSize}>
          <GppGood fontSize="inherit" color="primary" />;
        </Icon>
      </Tooltip>
    );
  }

  if (!props.active) {
    return (
      <Tooltip title="Pending campaign">
        <Icon fontSize={props.fontSize}>
          <PendingActions fontSize="inherit" color="warning" />;
        </Icon>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Rejected campaign">
      <Icon fontSize={props.fontSize}>
        <GppBad fontSize="inherit" color="error" />;
      </Icon>
    </Tooltip>
  );
}
