import { Button, Modal, Stack, Text } from '@mantine/core';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import useFirebase from '../../providers/useFirebase';
import { STORE_COLLECTIONS } from '../../shared/Constants';
import { ChannelEntity, ModalProps } from '../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';
import { UserPermissionProps } from './ChannelMembers';

export default function ConfirmUserPermissionModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;
  const { store } = useFirebase();

  const [isLoading, setIsLoading] = useState(false);

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, channel.id!);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;

    await updateDoc(channelSnapshot, {
      members: [...channelEntity.members, user!],
      admissionRequests: channelEntity.admissionRequests.filter(
        request => request.uid !== user?.uid
      ),
    });

    setSelectedChannel(previous => ({
      ...previous!,
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
      title="Confirm user admission">
      <Stack spacing="xl">
        <Text align="center">
          Are you sure you want to grant{' '}
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
        <Button onClick={handleConfirmClick} loading={isLoading}>
          Confirm
        </Button>
      </Stack>
    </Modal>
  );
}
