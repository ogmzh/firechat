import { parse } from 'date-fns';
import useFirebase from '../../../providers/useFirebase';
import { MessageEntity } from '../../../shared/Types';

export default function ChatMessage({ message }: { message: MessageEntity }) {
  const { user } = useFirebase();

  const { text, uid, createdAt } = message;
  const isSent = uid === user?.uid;
  return (
    <p style={{ color: isSent ? 'red' : 'blue' }}>{`${text} at ${
      createdAt ? parse(String(createdAt.seconds), 't', new Date()) : new Date()
    }`}</p>
  );
}
