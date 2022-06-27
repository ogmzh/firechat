import { UserProfile } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
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

  const banUserFromChannel = async (bannedUser: UserProfile, channelId: string) => {
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, channelId);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;

    await updateDoc(channelSnapshot, {
      members: channelEntity.members.filter(member => member.uid !== bannedUser.uid),
      banned: [...channelEntity.banned, bannedUser],
    });
  };

  const confirmChannelPermissionRequest = async (newUser: UserProfile, channelId: string) => {
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, channelId);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;

    await updateDoc(channelSnapshot, {
      members: [...channelEntity.members, newUser!],
      admissionRequests: channelEntity.admissionRequests.filter(
        request => request.uid !== newUser?.uid
      ),
    });
  };

  const confirmDenyChannelPermissionRequest = async (newUser: UserProfile, channelId: string) => {
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, channelId);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;
    await updateDoc(channelSnapshot, {
      admissionRequests: channelEntity.admissionRequests.filter(
        request => request.uid !== newUser?.uid
      ),
    });
  };

  return {
    channels,
    createChannel,
    banUserFromChannel,
    confirmChannelPermissionRequest,
    confirmDenyChannelPermissionRequest,
  };
}
