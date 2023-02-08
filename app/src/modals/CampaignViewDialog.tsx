import { Dialog, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import { useContext } from 'react';
import { ReBuild3 } from '../../../solidity/typechain-types';
import { UserContext } from '../contexts/UserContext';

export type CampaignDialogProps = DialogProps & {
  campaignid: number;
};

export default function CampaignViewDialog(props: CampaignDialogProps) {
  const { campaigns } = useContext(UserContext);
  const campaign = campaigns[props.campaignid];
  if (campaign) {
    return (
      <Dialog fullScreen {...props}>
        <DialogTitle>{campaign.title}</DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    );
  } else {
    return <></>;
  }

  {
    /* {campaign.organization === userAddress && !campaign.active && (
                      <Button
                        onClick={() => {
                          handleApproveCampaign(campaignId);
                        }}
                        endIcon={<AddTask />}>
                        Approve
                      </Button>
                    )}

                    {campaign.organization === userAddress &&
                      campaign.active &&
                      !campaign.released &&
                      campaign.raised.toBigInt() >= campaign.goal.toBigInt() && (
                        <Button
                          onClick={() => {
                            handleReleaseCampaign(campaignId);
                          }}
                          endIcon={<Logout />}>
                          Release
                        </Button>
                      )} */
  }
}
