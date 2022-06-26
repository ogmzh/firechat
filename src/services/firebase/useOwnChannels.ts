import { addDoc, collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../shared/Constants';
import { genericConverter } from '../../shared/Converters';
import { ChannelEntity } from '../../shared/Types';
import { authUserToProfile } from '../../shared/Utils';

export default function useOwnChannels() {
  const { store, user } = useFirebase();

  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(
    genericConverter
  );

  const q = query<ChannelEntity>(channelsRef, where('admin.uid', '==', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);

  const createChannel = (data: Omit<ChannelEntity, 'admin'>) => {
    addDoc<ChannelEntity>(channelsRef, { ...data, admin: authUserToProfile(user!) });
  };

  return { channels, createChannel };
}
