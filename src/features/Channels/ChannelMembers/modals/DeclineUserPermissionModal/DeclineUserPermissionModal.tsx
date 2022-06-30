import { Text } from '@mantine/core';
import { useState } from 'react';
import useOwnChannels from '../../../../../services/firebase/channels/useOwnChannels';
import useUserManagement from '../../../../../services/firebase/users/useUserManagement';
import { ModalProps } from '../../../../../shared/Types';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function DeclineUserPermissionModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;

  const { removeChannelPermissionRequest } = useOwnChannels();
  const { removeChannelRequestForUser } = useUserManagement();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await removeChannelPermissionRequest(user!, channel.id!);
    await removeChannelRequestForUser(user!, channel!);
    setIsModalOpen(false);
    setIsLoading(false);
  };

  return (
    <ChannelControlModal
      label="Deny user channel admission"
      isLoading={isLoading}
      channel={channel}
      handleConfirmClick={handleConfirmClick}
      isModalOpen={!!user}
      setIsModalOpen={() => setIsModalOpen(false)}
      user={user}>
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
    </ChannelControlModal>
  );
}
