import { Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import useOwnChannels from '../../../../services/firebase/useOwnChannels';
import { ModalProps } from '../../../../shared/Types';
import { selectedChannelAtom } from '../../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function ConfirmUserPermissionModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;

  const { confirmChannelPermissionRequest } = useOwnChannels();
  const [isLoading, setIsLoading] = useState(false);
  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await confirmChannelPermissionRequest(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      members: [...previous!.members, user!],
      admissionRequests: previous!.admissionRequests.filter(request => request.uid !== user?.uid),
    }));
    setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <ChannelControlModal
      isLoading={isLoading}
      label="Confirm user admission"
      channel={channel}
      handleConfirmClick={handleConfirmClick}
      isModalOpen={!!user}
      setIsModalOpen={() => setIsModalOpen(false)}
      user={user}>
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
    </ChannelControlModal>
  );
}
