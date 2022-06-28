import { Divider, Stack, StackProps, Text } from '@mantine/core';
import { atom } from 'jotai';
import useCommunalChannels from '../../../services/firebase/channels/useCommunalChannels';
import useOwnChannels from '../../../services/firebase/channels/useOwnChannels';
import { ChannelEntity } from '../../../shared/Types';
import ChannelLink from '../../../components/ChannelLink/ChannelLink';

export const selectedChannelAtom = atom<ChannelEntity | null>(null);

export default function ChannelStack(props: StackProps) {
  const { channels: ownedChannels } = useOwnChannels();
  const { memberOfChannels } = useCommunalChannels();
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
      <Stack hidden={!!memberOfChannels ? memberOfChannels.length === 0 : true} mt="md">
        <Divider my="sm" />
        <Text size="sm">Member of</Text>
        {memberOfChannels?.map(channel => (
          <ChannelLink key={channel.id} channel={channel} />
        ))}
      </Stack>
    </>
  );
}
