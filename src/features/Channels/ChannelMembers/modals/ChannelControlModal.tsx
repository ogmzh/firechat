import { Button, Group, LoadingOverlay, Modal, Stack } from '@mantine/core';
import { FC, ReactNode } from 'react';
import { ModalProps } from '../../../../shared/Types';
import { UserPermissionProps } from '../ChannelMembers';

type ControlModalProps = {
  label: string;
  handleConfirmClick: () => void;
  children?: ReactNode;
  isLoading: boolean;
};

const ChannelControlModal: FC<ControlModalProps & ModalProps & UserPermissionProps> = props => {
  const { label, setIsModalOpen, isModalOpen, handleConfirmClick, isLoading, children } = props;
  return (
    <>
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
        title={label}>
        <LoadingOverlay visible={isLoading} />
        <Stack spacing="xl">{children}</Stack>
        <Group style={{ justifyContent: 'center' }} mt="md">
          <Group style={{ flex: 1 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="outline" fullWidth>
              Cancel
            </Button>
          </Group>
          <Group style={{ flex: 1 }}>
            <Button onClick={handleConfirmClick} fullWidth>
              Confirm
            </Button>
          </Group>
        </Group>
      </Modal>
    </>
  );
};

export default ChannelControlModal;
