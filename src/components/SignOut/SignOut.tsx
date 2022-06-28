import { Button } from '@mantine/core';
import { signOut } from 'firebase/auth';
import { useSetAtom } from 'jotai';
import useFirebase from '../../providers/useFirebase';
import { selectedChannelAtom } from '../../features/Channels/ChannelStack/ChannelStack';

export default function SignOut() {
  const { auth } = useFirebase();

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleSignOut = () => {
    if (auth) {
      setSelectedChannel(null);
      signOut(auth);
    }
  };

  return (
    <Button fullWidth variant="subtle" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
