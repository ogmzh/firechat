import { addDoc, collection, orderBy, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChatType, MessageEntity, UserProfile } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export default function useMessages(
  channelId: string,
  chatType: ChatType,
  recipient: UserProfile | null
) {
  const { store, user } = useFirebase();

  const channelRef = collection(
    store!,
    STORE_COLLECTIONS.CHANNELS.ROOT,
    channelId,
    STORE_COLLECTIONS.CHANNELS.CHAT_ROOM,
    chatType,
    STORE_COLLECTIONS.CHANNELS.MESSAGES
  ).withConverter(genericConverter);

  const q =
    chatType === '1-on-1'
      ? recipient
        ? query(channelRef, where('recipient.uid', '==', recipient.uid), orderBy('createdAt'))
        : query(channelRef, where('1', '==', 2)) // disable the query from fetching all "1-on-1" messages
      : query(channelRef, orderBy('createdAt'));

  const [messages] = useCollectionData(q);

  const sendMessage = async (value: string) => {
    let message: MessageEntity = {
      text: value,
      createdAt: new Date(),
      channelId,
    };

    if (chatType !== 'anonymous') {
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

  return { messages: messages as MessageEntity[], sendMessage };
}
