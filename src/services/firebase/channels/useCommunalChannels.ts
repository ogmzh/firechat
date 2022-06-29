import { collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChannelEntity } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export default function useCommunalChannels() {
  const { store, user } = useFirebase();

  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(
    genericConverter
  );
  const q = query(channelsRef, where('admin.uid', '!=', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);

  // returns true if the user had already submitted a request to join
  // and `this` request was a request to cancel the admission request  Promise<boolean>
  const requestToggleChannelAccess = async (id: string) => {
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, id);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;
    // const existingAdmissionRequest = channelEntity.admissionRequests?.some(
    //   existingUser => existingUser?.uid === user?.uid
    // );
    // await updateDoc(channelSnapshot, {
    //   admissionRequests: existingAdmissionRequest
    //     ? channelEntity.admissionRequests.filter(existingUser => existingUser.uid !== user?.uid)
    //     : [...channelEntity.admissionRequests, authUserToProfile(user!)],
    // });

    // return existingAdmissionRequest;
  };

  return {
    requestToggleChannelAccess,
    searchableChannels: channels?.filter(channel => channel.privacy === 'public'),
    // .filter(channel => !channel.banned.some(bannedUser => bannedUser.uid === user?.uid)),
    // .filter(channel => !channel.members.some(existingUser => existingUser.uid === user?.uid)),
    memberOfChannels: channels?.filter(channel => channel.privacy === 'public'),
    // .filter(channel => !channel.banned.some(bannedUser => bannedUser.uid === user?.uid)),
    // .filter(channel => channel.members.some(existingUser => existingUser.uid === user?.uid)),
  };
}
