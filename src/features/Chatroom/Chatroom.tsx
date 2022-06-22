import { getApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { FormEvent, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { MessageEntity } from '../../shared/Types';
import ChatMessage from './ChatMessage/ChatMessage';

const Chatroom = () => {
  const app = getApp('firechat');
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const store = getFirestore(getApp('firechat'));

  const [inputValue, setInputValue] = useState<string>('');

  const messagesRef = collection(store, 'messages').withConverter(converter);
  const q = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(q);

  const scrollToRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { uid, photoURL } = user as User;

    addDoc(messagesRef, { uid, photoURL, text: inputValue });
    setInputValue('');
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        {messages &&
          messages.map(message => (
            <ChatMessage key={message.id} message={message as MessageEntity} />
          ))}
      </div>
      <form onSubmit={e => sendMessage(e)}>
        <input
          placeholder="Chat here"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button type="submit">Say</button>
      </form>
      <div ref={scrollToRef} style={{ paddingTop: '20px' }}>
        bla
      </div>
    </>
  );
};

const converter = {
  toFirestore(post: any) {
    return { ...post, bro: 'ho', createdAt: serverTimestamp() };
  },
  fromFirestore(snapshot: any, options: any) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    };
  },
};

export default Chatroom;
