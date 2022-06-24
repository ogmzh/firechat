import { Text } from '@mantine/core';
import { parse } from 'date-fns';
import useFirebase from '../../../providers/useFirebase';
import { MessageEntity } from '../../../shared/Types';

export default function ChatMessage({ message }: { message: MessageEntity }) {
  const { user } = useFirebase();

  const { text, uid, createdAt } = message;
  const isSent = uid === user?.uid;
  return (
    <Text>{`${text} at ${
      createdAt ? parse(String(createdAt.seconds), 't', new Date()) : new Date()
    }`}</Text>
  );
}
