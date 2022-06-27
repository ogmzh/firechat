import { Button, Modal, Stack, Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import useOwnChannels from '../../../services/firebase/useOwnChannels';
import { ModalProps } from '../../../shared/Types';
import { selectedChannelAtom } from '../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../ChannelMembers';

export default function DeclineUserPermissionModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;

  const { confirmDenyChannelPermissionRequest } = useOwnChannels();
  const [isLoading, setIsLoading] = useState(false);

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    setIsLoading(true);

    confirmDenyChannelPermissionRequest(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      members: previous!.members.filter(member => member.uid !== user?.uid),
      admissionRequests: previous!.admissionRequests.filter(request => request.uid !== user?.uid),
    }));
    setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <Modal
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
      withCloseButton={false}
      opened={!!user}
      onClose={() => setIsModalOpen(false)}
      title="Confirm user denial">
      <Stack spacing="xl">
        <Text align="center">
          Are you sure you want to refuse{' '}
          <Text weight={600} style={{ display: 'inline' }}>
            {user?.displayName}
          </Text>{' '}
          admission to your channel
          <Text weight={600} style={{ display: 'inline' }}>
            {' '}
            {channel.name}
          </Text>
          ?
        </Text>
        <Button onClick={handleConfirmClick} color="red" loading={isLoading}>
          Confirm
        </Button>
      </Stack>
    </Modal>
  );
}
