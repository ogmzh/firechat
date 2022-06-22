import { parse } from 'date-fns';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MessageEntity } from '../../../shared/Types';

export default function ChatMessage({ message }: { message: MessageEntity }) {
  const app = getApp('firechat');
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const { text, uid, createdAt } = message;
  const isSent = uid === user?.uid;
  return (
    <p style={{ color: isSent ? 'red' : 'blue' }}>{`${text} at ${
      createdAt ? parse(String(createdAt.seconds), 't', new Date()) : 'no date'
    }`}</p>
  );
}
