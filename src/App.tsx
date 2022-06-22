import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chatroom from './features/Chatroom/Chatroom';
import SignIn from './features/Signin/SignIn';

function App() {
  const app = getApp('firechat');
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  return (
    <div>
      <header>lmaochat</header>
      <SignIn />
      {user && <Chatroom />}
    </div>
  );
}

export default App;
