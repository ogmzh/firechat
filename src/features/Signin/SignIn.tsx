import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import useFirebase from '../../providers/useFirebase';

export default function SignIn() {
  const { auth, user } = useFirebase();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    if (auth) {
      signInWithPopup(auth, provider);
    }
  };

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
    }
  };

  return (
    <>
      {user ? (
        <button onClick={handleSignOut}>sign out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with google</button>
      )}
    </>
  );
}
