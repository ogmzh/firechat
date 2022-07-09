import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore';
import { uniqBy } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useFirebase from '../../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../../shared/Constants';
import { genericConverter } from '../../../shared/Converters';
import { ChatType, MessageEntity, UserProfile } from '../../../shared/Types';
import { authUserToProfile } from '../../../shared/Utils';

export const DEFAULT_PAGE_SIZE = 12;

export default function usePaginatedMessages(
  channelId: string,
  chatType: ChatType,
  recipient: UserProfile | null
) {
  const { store, user } = useFirebase();

  const latestDocumentRef = useRef<QueryDocumentSnapshot | null>(null);
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setMessages([]);
    latestDocumentRef.current = null;
  }, [channelId, chatType, recipient]);

  const channelRef = collection(
    store!,
    STORE_COLLECTIONS.CHANNELS.ROOT,
    channelId,
    STORE_COLLECTIONS.CHANNELS.CHAT_ROOM,
    chatType,
    STORE_COLLECTIONS.CHANNELS.MESSAGES
  ).withConverter(genericConverter);

  const firstPageQuery = useMemo(
    () =>
      chatType === '1-on-1'
        ? recipient
          ? query(
              channelRef,
              where('participants', 'in', [
                [recipient.uid, user?.uid!],
                [user?.uid!, recipient.uid],
              ]),
              orderBy('createdAt', 'desc'),
              limit(DEFAULT_PAGE_SIZE)
            )
          : query(channelRef, where('1', '==', 2)) // disable the query from fetching all "1-on-1" messages when there's no recipient
        : query(channelRef, orderBy('createdAt', 'desc'), limit(DEFAULT_PAGE_SIZE)),
    [channelId, chatType, recipient]
  );

  const [data, loading, error, snapshot] = useCollectionData<MessageEntity>(firstPageQuery);

  useEffect(() => {
    if (snapshot && !latestDocumentRef.current) {
      setHasMore(!snapshot.empty);
      latestDocumentRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
    }
  }, [snapshot]);

  useEffect(() => {
    if (data) {
      setMessages(uniqBy([...data, ...messages], 'id'));
    }
  }, [data]);

  const loadMore = async () => {
    const snapshot = await getDocs<MessageEntity>(
      query(firstPageQuery, startAfter(latestDocumentRef.current))
    );
    latestDocumentRef.current = snapshot.docs[snapshot.docs.length - 1];
    const newPageMessages = snapshot.docs.map(document => document.data());
    setMessages(uniqBy([...messages, ...newPageMessages], 'id'));
    setHasMore(!snapshot.empty);
  };

  const sendMessage = async (value: string) => {
    let message: MessageEntity = {
      text: value,
      createdAt: Timestamp.fromDate(new Date()),
      channelId,
    };

    if (chatType !== 'anonymous') {
      message.author = authUserToProfile(user!);
      if (recipient) {
        message.recipient = recipient;
        message.participants = [recipient.uid, user?.uid!];
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

  return {
    messages,
    error,
    loadMore,
    sendMessage,
    hasMore,
    isLoading: loading,
  };
}
