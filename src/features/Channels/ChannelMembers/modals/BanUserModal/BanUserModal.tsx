import { Mark, Text } from '@mantine/core';
import { useState } from 'react';
import { useOwnChannel } from '../../../../../services/firebase/channels/useOwnChannels';
import useUserManagement from '../../../../../services/firebase/users/useUserManagement';
import { ModalProps } from '../../../../../shared/Types';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function BanUserModal(props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps) {
  const { user, channel, setIsModalOpen } = props;

  const { banUserFromChannel } = useOwnChannel(channel!);
  const [isLoading, setIsLoading] = useState(false);
  const { banUser } = useUserManagement();

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await banUserFromChannel(user!);
    await banUser(user!, channel);
    setIsModalOpen(false);
    setIsLoading(false);
  };
  return (
    <ChannelControlModal
      label="Confirm user ban"
      isLoading={isLoading}
      channel={channel}
      handleConfirmClick={handleConfirmClick}
      isModalOpen={!!user}
      setIsModalOpen={() => setIsModalOpen(false)}
      user={user}>
      <Text align="center">
        Are you sure you want to <Mark>ban</Mark>{' '}
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
    </ChannelControlModal>
  );
}
