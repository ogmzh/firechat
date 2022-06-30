import { UserCredential } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { omit } from 'lodash-es';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { ChannelEntity, UserProfile } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export const useUser = (uid: string) => {
  const { store } = useFirebase();
  const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, uid);

  const [userDocument] = useDocumentData(userRef);

  const requestToggleUserAccess = async (channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, uid);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    const existingChannelRequest = existingUserProfile.admissionRequests?.some(
      request => request.id === channel.id!
    );

    await (existingChannelRequest
      ? updateDoc(userRef, {
          ...existingUserProfile,
          admissionRequests: existingUserProfile.admissionRequests?.filter(
            existingChannel => existingChannel.id !== channel.id
          ),
        })
      : updateDoc(userRef, {
          ...existingUserProfile,
          admissionRequests: [
            ...(existingUserProfile.admissionRequests ?? []),
            omit(channel, 'admin'),
          ],
        }));
  };

  return {
    channels: userDocument?.channels as ChannelEntity[],
    admissionRequests: userDocument?.admissionRequests as ChannelEntity[],
    requestToggleUserAccess,
  };
};

export default function useUserManagement() {
  const { store } = useFirebase();

  const createUserIfNotExists = async ({ user }: UserCredential) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user?.uid!);

    const existingUser = await getDoc(userRef);
    existingUser.exists()
      ? await updateDoc(userRef, { lastLogin: serverTimestamp() })
      : await setDoc(userRef, {
          ...authUserToProfile(user!),
          lastLogin: serverTimestamp(),
          channels: [],
          admissionRequests: [],
        });
  };

  const removeChannelFromUser = async (user: UserProfile, channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user.uid!);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    await updateDoc(userRef, {
      ...existingUserProfile,
      channels: existingUserProfile.channels?.filter(
        existingChannel => existingChannel.id !== channel.id
      ),
    });
  };

  const removeChannelRequestForUser = async (user: UserProfile, channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user.uid!);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    await updateDoc(userRef, {
      ...existingUserProfile,
      admissionRequests: existingUserProfile.admissionRequests?.filter(
        existingChannel => existingChannel.id !== channel.id
      ),
    });
  };

  const confirmChannelRequestForUser = async (user: UserProfile, channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user.uid!);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    await updateDoc(userRef, {
      ...existingUserProfile,
      admissionRequests: existingUserProfile.admissionRequests?.filter(
        existingChannel => existingChannel.id !== channel.id
      ),
      channels: [
        ...(existingUserProfile.channels ?? []),
        { ...omit(channel, ['admin', 'createdAt']) },
      ],
    });
  };

  const banUser = async (user: UserProfile, channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user.uid!);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    await updateDoc(userRef, {
      ...existingUserProfile,
      channels: existingUserProfile.channels?.filter(
        existingChannel => existingChannel.id !== channel.id
      ),
      bans: [...(existingUserProfile.bans ?? []), { ...omit(channel, ['admin', 'createdAt']) }],
    });
  };

  const unbanUser = async (user: UserProfile, channel: ChannelEntity) => {
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user.uid!);

    const existingUser = await getDoc(userRef);
    const existingUserProfile = existingUser.data() as UserProfile;
    await updateDoc(userRef, {
      ...existingUserProfile,
      bans: existingUserProfile.bans?.filter(existingChannel => existingChannel.id !== channel.id),
      channels: [
        ...(existingUserProfile.channels ?? []),
        { ...omit(channel, ['admin', 'createdAt']) },
      ],
    });
  };

  return {
    createUserIfNotExists,
    removeChannelFromUser,
    removeChannelRequestForUser,
    confirmChannelRequestForUser,
    banUser,
    unbanUser,
  };
}
