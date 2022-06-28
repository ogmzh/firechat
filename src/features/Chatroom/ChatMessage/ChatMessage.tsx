import { Text } from '@mantine/core';
import { parse } from 'date-fns';
import useFirebase from '../../../providers/useFirebase';
import { MessageEntity } from '../../../shared/Types';

export default function ChatMessage({ message }: { message: MessageEntity }) {
  const { user } = useFirebase();

  const { text, createdAt } = message;
  return <Text>{`${text} at ${new Date()}`}</Text>;
}
