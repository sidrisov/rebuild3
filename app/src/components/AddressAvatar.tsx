import Avatar, { AvatarProps } from 'boring-avatars';

export default function AddressAvatar(props: AvatarProps) {
  return <Avatar {...props} variant="pixel" colors={['#D10000', '#214FEB', '#1AD100']} />;
}
