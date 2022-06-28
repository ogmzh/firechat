import { Mark, Text } from '@mantine/core';
import { useSetAtom } from 'jotai';
import useOwnChannels from '../../../../services/firebase/useOwnChannels';
import { ModalProps } from '../../../../shared/Types';
import { selectedChannelAtom } from '../../../ChannelStack/ChannelStack';
import { UserPermissionProps } from '../../ChannelMembers';
import ChannelControlModal from '../ChannelControlModal';

export default function BanUserModal(props: Omit<ModalProps, 'isModalOpen'> & UserPermissionProps) {
  const { user, channel, setIsModalOpen } = props;

  const { banUserFromChannel } = useOwnChannels();

  const setSelectedChannel = useSetAtom(selectedChannelAtom);

  const handleConfirmClick = async () => {
    await banUserFromChannel(user!, channel.id!);

    setSelectedChannel(previous => ({
      ...previous!,
      members: previous!.members.filter(member => member.uid !== user!.uid),
      banned: [...previous!.banned, user!],
    }));
    setIsModalOpen(false);
  };
  return (
    <ChannelControlModal
      label="Confirm user ban"
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
