import { getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SignIn() {
  const app = getApp('firechat');
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <button onClick={() => signOut(auth)}>sign out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with google</button>
      )}
    </>
  );
}
