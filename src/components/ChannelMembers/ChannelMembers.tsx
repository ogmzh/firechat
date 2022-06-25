import { Box, Stack, Text, useMantineTheme } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Checkbox, SquareX } from 'tabler-icons-react';
import useFirebase from '../../providers/useFirebase';
import { ChannelEntity, UserProfile } from '../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';
import ConfirmUserPermissionModal from './ConfirmUserPermissionModal';
import DeclineUserPermissionModal from './DeclineUserPermissionModal';

export type UserPermissionProps = {
  user: UserProfile | null;
  channel: ChannelEntity;
};

export default function ChannelMembers() {
  const [confirmUser, setConfirmUser] = useState<UserProfile | null>(null);
  const [declineUser, setDeclineUser] = useState<UserProfile | null>(null);
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
          <Text>Member requests</Text>
          {selectedChannel?.admissionRequests.map(user => (
            <Box
              key={user.uid}
              sx={theme => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colors.dark[5],
                },
              })}>
              <Text>{user.displayName}</Text>
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
            </Box>
          ))}
        </>
      )}
    </Stack>
  );
}
