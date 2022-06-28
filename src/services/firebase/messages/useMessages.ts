import { collection, orderBy, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { UserProfile } from '../../../shared/Types';

export default function useMessages(channelId: string) {
  const { store, user } = useFirebase();

  const messagesRef = collection(store!, STORE_COLLECTIONS.MESSAGES).withConverter(
    genericConverter
  );
  const q = query(messagesRef, where('channelId', '==', channelId), orderBy('createdAt'));
  const [messages] = useCollectionData(q);

  const sendMessage = async (value: string, user: UserProfile) => {
    const { uid, displayName, photoURL } = user;
    q;
  };
  return { messages };
}
