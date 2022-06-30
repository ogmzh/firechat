import { Button } from '@mantine/core';
import { useAtom } from 'jotai';
import useFirebase from '../../../providers/useFirebase';
import { useOwnChannel } from '../../../services/firebase/channels/useOwnChannels';
import useUserManagement from '../../../services/firebase/users/useUserManagement';
import { authUserToProfile } from '../../../shared/Utils';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';

export default function ChannelOptions() {
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const { user } = useFirebase();
  const { kickUserFromChannel } = useOwnChannel(selectedChannel!);
  const { removeChannelFromUser } = useUserManagement();

  const handleLeaveChannel = async () => {
    setSelectedChannel(null);
    const userProfile = authUserToProfile(user!);
    await kickUserFromChannel(userProfile.uid);
    await removeChannelFromUser(userProfile, selectedChannel!);
  };

  if (selectedChannel?.admin.uid === user?.uid) {
    return null; // only display for non admin users
  }

  return (
    <Button fullWidth color="orange" onClick={() => handleLeaveChannel()}>
      Leave channel
    </Button>
  );
}
