import { Box, Stack, Text } from '@mantine/core';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import { UserProfile } from '../../../../shared/Types';
import { selectedUserAtom } from '../../ChannelStack/ChannelStack';

type ChannelMemberProps = {
  user: UserProfile;
  canSelectUser?: boolean;
  children: ReactNode;
};

export default function ChannelMember({
  user,
  canSelectUser = false,
  children,
}: ChannelMemberProps) {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  return (
    <Box
      onClick={() => canSelectUser && setSelectedUser(user)}
      sx={theme => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.xs,
        border: selectedUser?.uid === user.uid ? '1px solid orange' : '0',
        backgroundColor: selectedUser?.uid === user.uid ? theme.colors.dark[4] : 'inherit',
        borderRadius: theme.radius.sm,
        '&:hover': {
          backgroundColor: theme.colors.dark[5],
        },
      })}>
      <Stack spacing="xs">
        <Text weight={700}>{user.displayName}</Text>
        <Text weight={200} size="xs">
          {user.email}
        </Text>
      </Stack>
      {children}
    </Box>
  );
}
