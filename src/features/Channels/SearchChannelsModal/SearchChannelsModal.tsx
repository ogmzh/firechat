import { Box, Input, Modal, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { differenceBy } from 'lodash-es';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { GitPullRequest } from 'tabler-icons-react';
import useFirebase from '../../../providers/useFirebase';
import useCommunalChannels from '../../../services/firebase/channels/useCommunalChannels';
import { useUser } from '../../../services/firebase/users/useUserManagement';
import { getToastifyProps } from '../../../shared/Constants';
import { ChannelEntity, ModalProps } from '../../../shared/Types';

export default function SearchChannelsModal(props: ModalProps) {
  const { isModalOpen, setIsModalOpen } = props;

  const mantineTheme = useMantineTheme();

  const [name, setName] = useInputState('');
  const [debouncedName] = useDebouncedValue(name, 300);

  const { user } = useFirebase();

  const { publicChannels, requestToggleChannelAccess } = useCommunalChannels();
  const { channels, admissionRequests, bannedChannels, requestToggleUserAccess } = useUser(
    user?.uid!
  );

  const searchableChannels = useMemo(() => {
    const nonJoinedPublicChannels = differenceBy(
      publicChannels,
      [...(channels ?? []), ...(bannedChannels ?? [])],
      'id'
    );

    return debouncedName
      ? nonJoinedPublicChannels.filter(channel =>
          channel.name.toLowerCase().includes(debouncedName.toLowerCase())
        )
      : nonJoinedPublicChannels;
  }, [channels, publicChannels, bannedChannels, debouncedName]);

  const handleRequestChannelAccess = async (channel: ChannelEntity): Promise<void> => {
    requestToggleUserAccess(channel);
    const previousAdmissionRequestCancelled = await requestToggleChannelAccess(channel.id!);

    toast[previousAdmissionRequestCancelled ? 'info' : 'success'](
      previousAdmissionRequestCancelled
        ? 'Cancelled your join channel request.'
        : 'Successfully requested to join channel.',
      getToastifyProps(mantineTheme)
    );
  };

  return (
    <Modal
      transition="fade"
      transitionDuration={200}
      transitionTimingFunction="ease"
      overlayOpacity={0.55}
      overlayBlur={3}
      withCloseButton={false}
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Search existing channels">
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
        <Stack spacing="xs" style={{ display: 'flex', width: '100%' }}>
          {searchableChannels?.map(channel => (
            <Box
              key={channel.id}
              sx={theme => ({
                marginTop: theme.spacing.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              })}>
              <div>
                <Text size="xs">{`${channel.admin.email}: ${channel.admin.displayName}`}</Text>
                <Text lineClamp={1} title={channel.name} size="xl">
                  {channel.name}
                </Text>
              </div>
              <GitPullRequest
                size={28}
                cursor="pointer"
                color={
                  admissionRequests?.some(requestChannel => requestChannel.id === channel.id)
                    ? 'lime'
                    : 'cyan'
                }
                onClick={() => handleRequestChannelAccess(channel)}
              />
            </Box>
          ))}
        </Stack>
      </div>
    </Modal>
  );
}
