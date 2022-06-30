import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { ArrowBackUp, Ban, Checkbox, SquareRotatedOff, SquareX } from 'tabler-icons-react';
import useFirebase from '../../../providers/useFirebase';
import { useOwnChannel } from '../../../services/firebase/channels/useOwnChannels';
import { useUser } from '../../../services/firebase/users/useUserManagement';
import { ChannelEntity, UserProfile } from '../../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';

import ChannelMember from './ChannelMember/ChannelMember';
import BanUserModal from './modals/BanUserModal/BanUserModal';
import ConfirmUserPermissionModal from './modals/ConfirmUserPermissionModal/ConfirmUserPermissionModal';
import DeclineUserPermissionModal from './modals/DeclineUserPermissionModal/DeclineUserPermissionModal';
import KickUserModal from './modals/KickUserModal/KickUserModal';
import UnbanUserModal from './modals/UnbanUserModal/UnbanUserModal';

export type UserPermissionProps = {
  user: UserProfile | null;
  channel: ChannelEntity;
};

export default function ChannelMembers() {
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);
  const [declineUser, setDeclineUser] = useState<UserProfile | null>(null);
  const [kickUser, setKickUser] = useState<UserProfile | null>(null);
  const [banUser, setBanUser] = useState<UserProfile | null>(null);
  const [unbanUser, setUnbanUser] = useState<UserProfile | null>(null);
  const selectedChannel = useAtomValue(selectedChannelAtom);
  const mantineTheme = useMantineTheme();
  const { user } = useFirebase();

  const { admissionRequests, members, bannedUsers } = useOwnChannel(selectedChannel!);

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

          <Text mb="md">Member Requests</Text>
          {admissionRequests?.map(user => (
            <div key={user.uid}>
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
      <Text hidden={!members || members.length === 0}>Channel members</Text>
      {selectedChannel?.admin.uid !== user?.uid && (
        <ChannelMember user={selectedChannel!.admin}>
          <Text weight={200}>Admin</Text>
        </ChannelMember>
      )}
      {members?.map(member => (
        <div key={member.uid}>
          <ChannelMember user={member}>
            {selectedChannel && selectedChannel.admin.uid === user?.uid && (
              <>
                <BanUserModal
                  channel={selectedChannel}
                  setIsModalOpen={() => setBanUser(null)}
                  user={banUser}
                />
                <KickUserModal
                  channel={selectedChannel}
                  setIsModalOpen={() => setKickUser(null)}
                  user={kickUser}
                />
                <div>
                  <SquareRotatedOff
                    style={{ marginRight: mantineTheme.spacing.xs }}
                    size={28}
                    color="orange"
                    cursor="pointer"
                    onClick={() => setKickUser(member)}
                  />
                  <Ban size={28} color="red" cursor="pointer" onClick={() => setBanUser(member)} />
                </div>
              </>
            )}
          </ChannelMember>
        </div>
      ))}
      {selectedChannel &&
        user?.uid === selectedChannel?.admin.uid &&
        bannedUsers &&
        bannedUsers.length > 0 && (
          <>
            <UnbanUserModal
              channel={selectedChannel}
              setIsModalOpen={() => setUnbanUser(null)}
              user={unbanUser}
            />
            <Text>Banned users</Text>
            {bannedUsers.map(member => (
              <div key={member.uid}>
                <ChannelMember user={member}>
                  <ArrowBackUp
                    size={28}
                    color="cyan"
                    cursor="pointer"
                    onClick={() => setUnbanUser(member)}
                  />
                </ChannelMember>
              </div>
            ))}
          </>
        )}
    </Stack>
  );
}
