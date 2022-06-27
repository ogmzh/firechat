import { Stack, Text, useMantineTheme } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { ArrowBackUp, Ban, Checkbox, SquareRotatedOff, SquareX } from 'tabler-icons-react';
import useFirebase from '../../providers/useFirebase';
import { ChannelEntity, UserProfile } from '../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';
import ChannelMember from './ChannelMember/ChannelMember';
import BanUserModal from './modals/BanUserModal';
import ConfirmUserPermissionModal from './modals/ConfirmUserPermissionModal';
import DeclineUserPermissionModal from './modals/DeclineUserPermissionModal';
import KickUserModal from './modals/KickUserModal';
import UnbanUserModal from './modals/UnbanUserModal';

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
              <Text mb="md">Member Requests</Text>
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
      <Text hidden={selectedChannel?.members.length === 0}>Channel members</Text>
      {selectedChannel?.admin.uid !== user?.uid && (
        <ChannelMember user={selectedChannel!.admin}>
          <Text weight={200}>Admin</Text>
        </ChannelMember>
      )}
      {selectedChannel?.members
        .filter(member => member.uid !== user?.uid)
        .map(member => (
          <div key={member.uid}>
            <ChannelMember user={member}>
              {selectedChannel.admin.uid === user?.uid && (
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
                    <Ban
                      size={28}
                      color="red"
                      cursor="pointer"
                      onClick={() => setBanUser(member)}
                    />
                  </div>
                </>
              )}
            </ChannelMember>
          </div>
        ))}
      {user?.uid === selectedChannel?.admin.uid &&
        selectedChannel?.banned &&
        selectedChannel?.banned.length > 0 && (
          <>
            <UnbanUserModal
              channel={selectedChannel}
              setIsModalOpen={() => setUnbanUser(null)}
              user={unbanUser}
            />
            <Text>Banned users</Text>
            {selectedChannel?.banned.map(member => (
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
