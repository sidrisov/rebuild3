import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack
} from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ByUserType, CampaignStatus, Region } from '../../types/CampaignFiltersType';

export default function CampaignFiltersDialog(props: DialogProps) {
  const { isWalletConnected, campaignFilters, setCampaignFilters, regions } =
    useContext(UserContext);
  return (
    <Dialog {...props}>
      <DialogContent>
        <Stack spacing={1} direction="column">
          {isWalletConnected && (
            <FormControl>
              <FormLabel>User</FormLabel>
              <RadioGroup
                value={campaignFilters.user}
                onChange={(event, value) => {
                  setCampaignFilters({ ...campaignFilters, user: value as ByUserType });
                }}>
                <FormControlLabel value={'all' as ByUserType} control={<Radio />} label="All" />
                <FormControlLabel
                  value={'createdByMe' as ByUserType}
                  control={<Radio />}
                  label="Created by me"
                />
                <FormControlLabel
                  value={'assignedToMe' as ByUserType}
                  control={<Radio />}
                  label="Assigned to me"
                />
              </RadioGroup>
            </FormControl>
          )}

          {isWalletConnected && (
            <Divider
              orientation="horizontal"
              variant="middle"
              sx={{ border: 1, borderColor: 'divider', borderStyle: 'dashed' }}
            />
          )}

          <FormControl>
            <FormLabel>Status</FormLabel>
            <RadioGroup
              value={campaignFilters.status}
              onChange={(event, value) => {
                setCampaignFilters({ ...campaignFilters, status: value as CampaignStatus });
              }}>
              <FormControlLabel value={'all' as CampaignStatus} control={<Radio />} label="All" />
              <FormControlLabel
                value={'pending' as CampaignStatus}
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel value={'live' as CampaignStatus} control={<Radio />} label="Live" />
              <FormControlLabel
                value={'funded' as CampaignStatus}
                control={<Radio />}
                label="Funded"
              />
              <FormControlLabel
                value={'rejected' as CampaignStatus}
                control={<Radio />}
                label="Rejected"
              />
            </RadioGroup>
          </FormControl>

          <Divider
            orientation="horizontal"
            variant="middle"
            sx={{ border: 1, borderColor: 'divider', borderStyle: 'dashed' }}
          />
          <FormControl>
            <FormLabel>Region</FormLabel>
            <Select
              variant="standard"
              disableUnderline
              value={campaignFilters.region}
              onChange={(event) => {
                setCampaignFilters({ ...campaignFilters, region: event.target.value as Region });
              }}
              sx={{
                'label + &': {
                  marginTop: 1
                }
              }}>
              <MenuItem value={'all' as Region}>All</MenuItem>

              {regions.map((region) => {
                return (
                  <MenuItem key={`filter_region_item_${region}`} value={region}>
                    {region}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
