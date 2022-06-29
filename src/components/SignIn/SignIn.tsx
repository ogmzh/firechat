import { Button } from '@mantine/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useFirebase from '../../providers/useFirebase';
import useUser from '../../services/firebase/users/useUser';

const provider = new GoogleAuthProvider();

export default function SignIn() {
  const { auth } = useFirebase();
  const { createUserIfNotExists } = useUser();
  const handleSignInWithGoogle = () => {
    if (auth) {
      signInWithPopup(auth, provider).then(response => createUserIfNotExists(response));
    }
  };

  return (
    <Button fullWidth variant="filled" onClick={handleSignInWithGoogle}>
      Sign In with Google
    </Button>
  );
}
