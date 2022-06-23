import Chatroom from './features/Chatroom/Chatroom';
import SignIn from './features/SignIn/SignIn';
import useFirebase from './providers/useFirebase';

export default function RoutedApp() {
  const { user } = useFirebase();
  return (
    <div>
      <header>lmaochat</header>
      <SignIn />
      {user && <Chatroom />}
    </div>
  );
}
