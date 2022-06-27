import { Box, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { UserProfile } from '../../../shared/Types';

type ChannelMemberProps = { user: UserProfile; children: ReactNode };

export default function ChannelMember({ user, children }: ChannelMemberProps) {
  return (
    <Box
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
