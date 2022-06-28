import { Mark, Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import useOwnChannels from '../../../../../services/firebase/channels/useOwnChannels';
import { ModalProps } from '../../../../../shared/Types';
import { selectedChannelAtom } from '../../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function BanUserModal(props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps) {
  const { user, channel, setIsModalOpen } = props;

  const { banUserFromChannel } = useOwnChannels();
  const [isLoading, setIsLoading] = useState(false);
  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    await banUserFromChannel(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      members: previous!.members.filter(member => member.uid !== user!.uid),
      banned: [...previous!.banned, user!],
    }));
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
