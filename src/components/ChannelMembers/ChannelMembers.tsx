import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Ban, Checkbox, SquareX } from 'tabler-icons-react';
import useFirebase from '../../providers/useFirebase';
import { ChannelEntity, UserProfile } from '../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';
import ChannelMember from './ChannelMember/ChannelMember';
import BanUserModal from './modals/BanUserModal';
import ConfirmUserPermissionModal from './modals/ConfirmUserPermissionModal';
import DeclineUserPermissionModal from './modals/DeclineUserPermissionModal';

export type UserPermissionProps = {
  user: UserProfile | null;
  channel: ChannelEntity;
};

export default function ChannelMembers() {
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);
  const [declineUser, setDeclineUser] = useState<UserProfile | null>(null);
  const [banUser, setBanUser] = useState<UserProfile | null>(null);
  const selectedChannel = useAtomValue(selectedChannelAtom);
  const mantineTheme = useMantineTheme();
  const { user } = useFirebase();
  return (
    <Stack>
      {user?.uid === selectedChannel?.admin.uid && (
        <>
          <ConfirmUserPermissionModal
            channel={selectedChannel!}
            user={confirmUser}
            setIsModalOpen={() => setConfirmUser(null)}
          />
          <DeclineUserPermissionModal
            channel={selectedChannel!}
            user={declineUser}
            setIsModalOpen={() => setDeclineUser(null)}
          />

          {selectedChannel?.admissionRequests.map(user => (
            <div key={user.uid}>
              <Text>Member Requests</Text>
              <ChannelMember user={user}>
                <div>
                  <Checkbox
                    size={28}
                    color="lime"
                    cursor="pointer"
                    style={{ marginRight: mantineTheme.spacing.xs }}
                    onClick={() => setConfirmUser(user)}
                  />
                  <SquareX
                    size={28}
                    color="red"
                    cursor="pointer"
                    onClick={() => setDeclineUser(user)}
                  />
                </div>
              </ChannelMember>
            </div>
          ))}
        </>
      )}
      {selectedChannel?.members
        .filter(member => member.uid !== user?.uid)
        .map(member => (
          <div key={member.uid}>
            <Text>Channel members</Text>
            <ChannelMember user={member}>
              {selectedChannel.admin.uid === user?.uid && (
                <>
                  <BanUserModal
                    channel={selectedChannel}
                    setIsModalOpen={() => setBanUser(null)}
                    user={banUser}
                  />
                  <Ban size={28} color="red" cursor="pointer" onClick={() => setBanUser(member)} />
                </>
              )}
            </ChannelMember>
          </div>
        ))}
    </Stack>
  );
}
