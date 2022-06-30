import { Text } from '@mantine/core';
import { useState } from 'react';
import { useOwnChannel } from '../../../../../services/firebase/channels/useOwnChannels';
import useUserManagement from '../../../../../services/firebase/users/useUserManagement';
import { ModalProps } from '../../../../../shared/Types';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function KickUserModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { channel, user, setIsModalOpen } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { kickUserFromChannel } = useOwnChannel(channel!);
  const { removeChannelFromUser } = useUserManagement();
  const handleConfirmClick = async () => {
    setIsLoading(true);
    await kickUserFromChannel(user?.uid!);
    await removeChannelFromUser(user!, channel);
    setIsModalOpen(false);
    setIsLoading(false);
  };
  return (
    <ChannelControlModal
      label="Confirm user kick"
      isLoading={isLoading}
      channel={channel}
      handleConfirmClick={handleConfirmClick}
      isModalOpen={!!user}
      setIsModalOpen={() => setIsModalOpen(false)}
      user={user}>
      {
        <Text align="center">
          Are you sure you want to kick{' '}
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
      }
    </ChannelControlModal>
  );
}
