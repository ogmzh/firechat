import { Stack, StackProps } from '@mantine/core';
import { collection, query, where } from 'firebase/firestore';
import { atom, useAtom } from 'jotai';
import { isEqual } from 'lodash-es';
import { useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../shared/Constants';
import { genericConverter } from '../../shared/Converters';
import { ChannelEntity } from '../../shared/Types';
import ChannelLink from '../ChannelLink/ChannelLink';

export const selectedChannelAtom = atom<ChannelEntity | null>(null);
export const ownedChannelsAtom = atom<ChannelEntity[]>([]);

export default function ChannelStack(props: StackProps) {
  const { store, user } = useFirebase();
  const [ownedChannels, setOwnedChannels] = useAtom(ownedChannelsAtom);

  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(
    genericConverter
  );

  const q = query(channelsRef, where('admin', '==', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);

  useEffect(() => {
    if (!!channels && !isEqual(channels, ownedChannels)) {
      setOwnedChannels(channels);
    }
  }, [JSON.stringify(channels)]);

  return (
    <Stack {...props}>
      {channels?.map(channel => (
        <ChannelLink key={channel.id} channel={channel} />
      ))}
    </Stack>
  );
}
