import { addDoc, collection, doc, orderBy, query, setDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChatType, MessageEntity, UserProfile } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export default function useMessages(channelId: string, chatType: ChatType) {
  const { store, user } = useFirebase();

  const channelRef = collection(
    store!,
    STORE_COLLECTIONS.CHANNELS.ROOT,
    channelId,
    STORE_COLLECTIONS.CHANNELS.CHAT_ROOM,
    chatType,
    STORE_COLLECTIONS.CHANNELS.MESSAGES
  ).withConverter(genericConverter);

  const q = query(channelRef, orderBy('createdAt'));

  const [messages] = useCollectionData(q);

  const sendMessage = async (value: string, recipient?: UserProfile) => {
    let message: MessageEntity = {
      text: value,
      createdAt: new Date(),
      channelId,
    };

    if (chatType !== '1-on-1') {
      message.author = authUserToProfile(user!);
      if (recipient) {
        message.recipient = recipient;
      }
    }

    await addDoc(
      collection(
        store!,
        STORE_COLLECTIONS.CHANNELS.ROOT,
        channelId,
        STORE_COLLECTIONS.CHANNELS.CHAT_ROOM,
        chatType,
        STORE_COLLECTIONS.CHANNELS.MESSAGES
      ),
      message
    );
  };

  return { messages, sendMessage };
}
