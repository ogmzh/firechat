import { Button } from '@mantine/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useFirebase from '../../providers/useFirebase';

export default function SignIn() {
  const { auth } = useFirebase();
  const provider = new GoogleAuthProvider();

  const handleSignInWithGoogle = () => {
    if (auth) {
      signInWithPopup(auth, provider);
    }
  };

  return (
    <Button fullWidth variant="filled" onClick={handleSignInWithGoogle}>
      Sign In with Google
    </Button>
  );
}
