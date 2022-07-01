import { Divider, Stack, StackProps, Text } from '@mantine/core';
import { atom, useAtomValue } from 'jotai';
import ChannelLink from '../../../components/ChannelLink/ChannelLink';
import useFirebase from '../../../providers/useFirebase';
import useOwnChannels from '../../../services/firebase/channels/useOwnChannels';
import { useUser } from '../../../services/firebase/users/useUserManagement';
import { ChannelEntity, UserProfile } from '../../../shared/Types';

export const selectedChannelAtom = atom<ChannelEntity | null>(null);
export const selectedUserAtom = atom<UserProfile | null>(null);

export default function ChannelStack(props: StackProps) {
  const { channels: ownedChannels } = useOwnChannels();
  const { user } = useFirebase();

  const { channels } = useUser(user?.uid!);
  return (
    <>
      <Stack {...props}>
        <Text size="sm" hidden={!!ownedChannels ? ownedChannels.length === 0 : true}>
          Owner of
        </Text>
        {ownedChannels?.map(channel => (
          <ChannelLink key={channel.id} channel={channel} />
        ))}
      </Stack>
      <Stack hidden={!!channels ? channels.length === 0 : true} mt="md">
        <Divider my="sm" />
        <Text size="sm">Member of</Text>
        {channels?.map(channel => (
          <ChannelLink key={channel.id} channel={channel} />
        ))}
      </Stack>
    </>
  );
}
