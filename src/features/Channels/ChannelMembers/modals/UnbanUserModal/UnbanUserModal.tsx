import { Text } from '@mantine/core';
import { useState } from 'react';
import { useOwnChannel } from '../../../../../services/firebase/channels/useOwnChannels';
import { ModalProps } from '../../../../../shared/Types';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function UnbanUserModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { user, channel, setIsModalOpen } = props;
  const { unbanUserFromChannel } = useOwnChannel(channel.id!);

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await unbanUserFromChannel(user!);

    setIsModalOpen(false);
    setIsLoading(false);
  };
  return (
    <ChannelControlModal
      label="Confirm user unban"
      isLoading={isLoading}
      channel={channel}
      handleConfirmClick={handleConfirmClick}
      isModalOpen={!!user}
      setIsModalOpen={() => setIsModalOpen(false)}
      user={user}>
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
    </ChannelControlModal>
  );
}
