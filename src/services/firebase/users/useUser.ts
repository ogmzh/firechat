import { User, UserCredential } from 'firebase/auth';
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { authUserToProfile } from '../../../shared/Utils';

export default function useUser() {
  const { store } = useFirebase();

  const usersRef = collection(store!, STORE_COLLECTIONS.USERS.ROOT).withConverter(genericConverter);

  const createUserIfNotExists = async ({ user }: UserCredential) => {
    console.log('am i in at least', user.uid);
    const userRef = doc(store!, STORE_COLLECTIONS.USERS.ROOT, user?.uid!);

    const existingUser = await getDoc(userRef);
    console.log('bro?', existingUser);
    existingUser.exists()
      ? await updateDoc(userRef, { lastLogin: serverTimestamp() })
      : await setDoc(userRef, {
          ...authUserToProfile(user!),
          lastLogin: serverTimestamp(),
          channels: [],
          admissionRequests: [],
        });
  };

  return { createUserIfNotExists };
}
