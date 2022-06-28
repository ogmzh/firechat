import { Button } from '@mantine/core';
import { FormEvent, useRef, useState } from 'react';

import { addDoc, collection, orderBy, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import useFirebase from '../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../shared/Constants';
import { genericConverter } from '../../shared/Converters';
import { MessageEntity } from '../../shared/Types';
import ChatMessage from './ChatMessage/ChatMessage';

const _Chatroom = () => {
  const { store, user } = useFirebase();

  const messagesRef = collection(store!, STORE_COLLECTIONS.MESSAGES).withConverter(
    genericConverter
  );
  const q = query(messagesRef, orderBy('createdAt'));
  const [messages] = useCollectionData(q);

  const [inputValue, setInputValue] = useState<string>('');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { uid, photoURL } = user!;

    // addDoc<MessageEntity>(messagesRef, { author: {displayName: } text: inputValue });
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

export default _Chatroom;
