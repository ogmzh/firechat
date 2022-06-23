import { FormEvent, useRef, useState } from 'react';
import { Button } from '@mantine/core';

import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { MessageEntity } from '../../shared/Types';
import useFirebase from '../../providers/useFirebase';
import ChatMessage from './ChatMessage/ChatMessage';

const Chatroom = () => {
  const { store, user } = useFirebase();

  const messagesRef = collection(store!, 'messages').withConverter(converter);
  const q = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(q);

  const [inputValue, setInputValue] = useState<string>('');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { uid, photoURL } = user!;

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
        <Button type="submit" ml="10px">
          Say
        </Button>
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
