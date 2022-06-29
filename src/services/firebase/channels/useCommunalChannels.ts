import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChannelEntity } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export default function useCommunalChannels() {
  const { store, user } = useFirebase();

  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS.ROOT).withConverter(
    genericConverter
  );
  const q = query(channelsRef, where('admin.uid', '!=', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);

  const channelsMembersRef = collectionGroup(store!, STORE_COLLECTIONS.CHANNELS.MEMBERS);
  const q2 = query(channelsMembersRef, where('uid', '==', user?.uid!));
  const [stuff] = useCollectionData(q2);
  console.log({ stuff });

  // returns true if the user had already submitted a request to join
  // and `this` request was a request to cancel the admission request
  const requestToggleChannelAccess = async (id: string): Promise<boolean> => {
    const admissionRequestRef = doc(
      store!,
      STORE_COLLECTIONS.CHANNELS.ROOT,
      id,
      STORE_COLLECTIONS.CHANNELS.ADMISSION_REQUESTS,
      user?.uid!
    );

    const existingAdmission = await getDoc(admissionRequestRef);

    await (existingAdmission.exists()
      ? deleteDoc(admissionRequestRef)
      : setDoc(admissionRequestRef, authUserToProfile(user!)));

    return existingAdmission.exists();
  };

  return {
    requestToggleChannelAccess,
    searchableChannels: channels?.filter(channel => channel.privacy === 'public'),
    // .filter(channel => !channel.banned.some(bannedUser => bannedUser.uid === user?.uid)),
    // .filter(channel => !channel.members.some(existingUser => existingUser.uid === user?.uid)),
    memberOfChannels: [],
    // channels?.filter(channel => channel.privacy === 'public'),
    // .filter(channel => !channel.banned.some(bannedUser => bannedUser.uid === user?.uid)),
    // .filter(channel => channel.members.some(existingUser => existingUser.uid === user?.uid)),
  };
}
