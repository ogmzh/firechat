import { Stack, StackProps } from '@mantine/core';
import { collection, query, where } from 'firebase/firestore';
import { atom } from 'jotai';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../shared/Constants';
import { genericConverter } from '../../shared/Converters';
import { ChannelEntity } from '../../shared/Types';
import ChannelLink from '../ChannelLink/ChannelLink';

export const selectedChannelAtom = atom<ChannelEntity | null>(null);

export default function ChannelStack(props: StackProps) {
  const { store, user } = useFirebase();
  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(
    genericConverter
  );

  const q = query(channelsRef, where('admin', '==', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);
  return (
    <Stack {...props}>
      {channels?.map(channel => (
        <ChannelLink key={channel.id} channel={channel} />
      ))}
    </Stack>
  );
}
