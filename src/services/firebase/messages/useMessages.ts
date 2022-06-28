import {
  addDoc,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChannelEntity, MessageEntity } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export default function useMessages(channelId: string) {
  const { store, user } = useFirebase();

  const channelRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(genericConverter);
  const q = query(channelRef, orderBy('messages.createdAt'));
  const [messages] = useCollectionData(q);
  console.log('what about my mesages', messages);
  const sendMessage = async (value: string) => {
    const message: MessageEntity = {
      author: authUserToProfile(user!),
      text: value,
      createdAt: new Date(),
      channelId,
    };

    const channelSnapshot = doc<ChannelEntity>(channelRef, channelId);

    const channelDocumentRef = await getDoc(channelSnapshot);
    const channelEntity = channelDocumentRef.data();
    await updateDoc(channelSnapshot, {
      ...channelEntity,
      messages: [...channelEntity?.messages!, message],
    });
  };

  return { messages, sendMessage };
}
