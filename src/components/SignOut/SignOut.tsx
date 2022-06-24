import { Button } from '@mantine/core';
import { signOut } from 'firebase/auth';
import useFirebase from '../../providers/useFirebase';

export default function SignOut() {
  const { auth } = useFirebase();

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
    }
  };

  return (
    <Button fullWidth variant="subtle" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
