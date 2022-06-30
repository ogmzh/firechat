import { Text } from '@mantine/core';
import { useState } from 'react';
import { useOwnChannel } from '../../../../../services/firebase/channels/useOwnChannels';
import useUserManagement from '../../../../../services/firebase/users/useUserManagement';
import { ModalProps } from '../../../../../shared/Types';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function ConfirmUserPermissionModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;

  const { confirmChannelPermissionRequest } = useOwnChannel(channel!);
  const { confirmChannelRequestForUser } = useUserManagement();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await confirmChannelPermissionRequest(user!);
    await confirmChannelRequestForUser(user!, channel!);

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
