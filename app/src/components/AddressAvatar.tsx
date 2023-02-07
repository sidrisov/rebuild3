import { Avatar, AvatarProps } from '@mui/material';

export type AddressAvatarProps = AvatarProps & {
  address: string;
};

// TODO: generate with blockies lib to avoid extra network load
export default function AddressAvatar(props: AddressAvatarProps) {
  return <Avatar {...props} src={`https://cdn.stamp.fyi/avatar/${props.address}`} />;
}
