import { Button, Group, Input, Modal } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { addDoc, collection } from 'firebase/firestore';
import useFirebase from '../../providers/useFirebase';
import { genericConverter } from '../../shared/Converters';

interface ModalProps {
  isCreateChannelOpened: boolean;
  setIsCreateChannelOpened: (value: boolean) => void;
}

export default function CreateChannelModal(props: ModalProps) {
  const { isCreateChannelOpened, setIsCreateChannelOpened } = props;

  const [name, setName] = useInputState('');

  const { store, user } = useFirebase();

  const channelRef = collection(store!, 'channels').withConverter(genericConverter);

  const handleCreateChannel = () => {
    addDoc(channelRef, { name, admin: user?.uid, members: [], banned: [] });
    setName('');
    setIsCreateChannelOpened(false);
  };

  const handleCancelClick = () => {
    setName('');
    setIsCreateChannelOpened(false);
  };

  return (
    <Modal
      transition="fade"
      transitionDuration={600}
      transitionTimingFunction="ease"
      overlayOpacity={0.55}
      overlayBlur={3}
      centered
      withCloseButton={false}
      opened={isCreateChannelOpened}
      onClose={() => setIsCreateChannelOpened(false)}
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
        />
        <Group mt="md" spacing="xl">
          <Button color="orange" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button onClick={handleCreateChannel} disabled={!name}>
            Create
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
