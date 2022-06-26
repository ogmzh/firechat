import { Divider, Stack, StackProps, Text } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { atom, useAtom } from 'jotai';
import { isEqual } from 'lodash-es';
import useOwnChannels from '../../services/firebase/useOwnChannels';
import { ChannelEntity } from '../../shared/Types';
import ChannelLink from '../ChannelLink/ChannelLink';

export const selectedChannelAtom = atom<ChannelEntity | null>(null);
export const ownedChannelsAtom = atom<ChannelEntity[]>([]);

export default function ChannelStack(props: StackProps) {
  const [ownedChannels, setOwnedChannels] = useAtom(ownedChannelsAtom);

  const { channels } = useOwnChannels();

  useDidUpdate(() => {
    if (!!channels && !isEqual(channels, ownedChannels)) {
      setOwnedChannels(channels);
    }
  }, [channels]);

  return (
    <Stack {...props}>
      <Text size="sm" hidden={ownedChannels.length === 0}>
        Owner of
      </Text>
      {ownedChannels?.map(channel => (
        <ChannelLink key={channel.id} channel={channel} />
      ))}
      <Divider my="sm" />
      <Text size="sm">Member of</Text>
    </Stack>
  );
}
