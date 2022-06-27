import { Button, Chip, Chips, Group, Input, Modal, Tooltip } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import useOwnChannels from '../../services/firebase/useOwnChannels';
import { ChannelPrivacy, ModalProps } from '../../shared/Types';

export default function CreateChannelModal(props: ModalProps) {
  const { isModalOpen, setIsModalOpen } = props;

  const [name, setName] = useInputState('');
  const [privacy, setPrivacy] = useState<ChannelPrivacy>('public');

  const { createChannel, channels: ownedChannels } = useOwnChannels();

  const handleCreateChannel = () => {
    createChannel({
      name,
      privacy,
      members: [],
      banned: [],
      messages: [],
      admissionRequests: [],
    });
    setName('');
    setIsModalOpen(false);
  };

  const handleCancelClick = () => {
    setName('');
    setIsModalOpen(false);
  };

  const maxNumberOfChannelsReached = ownedChannels?.length === 5;
  const ErrorTooltip = (
    <Tooltip
      label="Can not create any more channels."
      position="right"
      placement="center"
      color="red">
      <AlertCircle size={16} style={{ display: 'block', opacity: 0.5 }} color="red" />
    </Tooltip>
  );

  return (
    <Modal
      transition="fade"
      transitionDuration={200}
      transitionTimingFunction="ease"
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
      withCloseButton={false}
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Create a new channel">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          flexDirection: 'column',
        }}>
        <Input
          style={{ width: '100%' }}
          variant="default"
          placeholder="Channel name"
          value={name}
          onChange={setName}
          disabled={maxNumberOfChannelsReached}
          invalid={maxNumberOfChannelsReached}
          rightSection={maxNumberOfChannelsReached && ErrorTooltip}
        />
        <Group mt="md">
          <Chips
            multiple={false}
            value={privacy}
            onChange={(value: string) => setPrivacy(value as ChannelPrivacy)}>
            <Chip value="public">Public</Chip>
            <Chip value="private">Private</Chip>
          </Chips>
        </Group>
        <Group
          mt="lg"
          style={{
            justifyContent: 'center',
            width: '100%',
          }}>
          <Group style={{ flex: 1 }}>
            <Button variant="outline" onClick={handleCancelClick} fullWidth>
              Cancel
            </Button>
          </Group>
          <Group style={{ flex: 1 }}>
            <Button
              onClick={handleCreateChannel}
              disabled={!name || maxNumberOfChannelsReached}
              fullWidth>
              Create
            </Button>
          </Group>
        </Group>
      </div>
    </Modal>
  );
}
