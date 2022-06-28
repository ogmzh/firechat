import { Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import useOwnChannels from '../../../../services/firebase/useOwnChannels';
import { ModalProps } from '../../../../shared/Types';
import { selectedChannelAtom } from '../../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function UnbanUserModal(
  props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps
) {
  const { user, channel, setIsModalOpen } = props;
  const { unbanUserFromChannel } = useOwnChannels();

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    await unbanUserFromChannel(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      banned: previous!.banned.filter(member => member.uid !== user!.uid),
      members: [...previous!.members, user!],
    }));
    setIsModalOpen(false);
  };
  return (
    <ChannelControlModal
      label="Confirm user unban"
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
