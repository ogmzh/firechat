import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import useOwnChannels from '../../../services/firebase/useOwnChannels';
import { ModalProps } from '../../../shared/Types';
import { selectedChannelAtom } from '../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../ChannelMembers';

export default function UnbanUserModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { user, channel, setIsModalOpen } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { unbanUserFromChannel } = useOwnChannels();

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await unbanUserFromChannel(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      banned: previous!.banned.filter(member => member.uid !== user!.uid),
      members: [...previous!.members, user!],
    }));
    setIsModalOpen(false);
    setIsLoading(false);
  };
  return (
    <Modal
      transition="fade"
      transitionDuration={200}
      transitionTimingFunction="ease"
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
      withCloseButton={false}
      opened={!!user}
      onClose={() => setIsModalOpen(false)}
      title="Confirm user unban">
      <Stack spacing="xl">
        <Text align="center">
          Are you sure you want to unban{' '}
          <Text weight={600} style={{ display: 'inline' }}>
            {user?.displayName}
          </Text>{' '}
          from your channel
          <Text weight={600} style={{ display: 'inline' }}>
            {' '}
            {channel.name}
          </Text>
          ?
        </Text>
        <Group style={{ justifyContent: 'center' }}>
          <Group style={{ flex: 1 }}>
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              loading={isLoading}
              fullWidth>
              Cancel
            </Button>
          </Group>
          <Group style={{ flex: 1 }}>
            <Button onClick={handleConfirmClick} loading={isLoading} fullWidth>
              Confirm
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}
