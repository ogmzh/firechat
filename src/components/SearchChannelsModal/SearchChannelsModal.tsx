import { Box, Input, Modal, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { toast } from 'react-toastify';
import { GitPullRequest } from 'tabler-icons-react';
import useFirebase from '../../providers/useFirebase';
import { getToastifyProps, STORE_COLLECTIONS } from '../../shared/Constants';
import { genericConverter } from '../../shared/Converters';
import { ChannelEntity, ModalProps } from '../../shared/Types';
import { authUserToProfile } from '../../shared/Utils';

export default function SearchChannelsModal(props: ModalProps) {
  const { isModalOpen, setIsModalOpen } = props;

  const mantineTheme = useMantineTheme();

  const [name, setName] = useInputState('');
  const [debouncedName] = useDebouncedValue(name, 300);

  const { user, store } = useFirebase();
  const channelsRef = collection(store!, STORE_COLLECTIONS.CHANNELS).withConverter(
    genericConverter
  );
  const q = query(channelsRef, where('admin.uid', '!=', user?.uid));
  const [channels] = useCollectionData<ChannelEntity>(q);
  const filteredChannels = useMemo(
    () =>
      channels
        ?.filter(channel => channel.privacy === 'public')
        .filter(channel => !channel.banned.some(bannedUser => bannedUser.uid === user?.uid))
        .filter(channel => !channel.members.some(existingUser => existingUser.uid === user?.uid))
        .filter(channel => channel.name.toLowerCase().includes(debouncedName?.toLowerCase())),
    [channels, debouncedName]
  );

  const handleRequestChannelAccess = async (id: string): Promise<void> => {
    const channelSnapshot = doc(store!, STORE_COLLECTIONS.CHANNELS, id);
    const channelRef = await getDoc(channelSnapshot);
    const channelEntity = channelRef.data() as ChannelEntity;
    const existingAdmissionRequest = channelEntity.admissionRequests?.some(
      existingUser => existingUser?.uid === user?.uid
    );
    await updateDoc(channelSnapshot, {
      admissionRequests: existingAdmissionRequest
        ? channelEntity.admissionRequests.filter(existingUser => existingUser.uid !== user?.uid)
        : [...channelEntity.admissionRequests, authUserToProfile(user!)],
    });

    toast[existingAdmissionRequest ? 'info' : 'success'](
      existingAdmissionRequest
        ? 'Cancelled your join channel request.'
        : 'Successfully requested to join channel.',
      getToastifyProps(mantineTheme)
    );

    // const tempBan = doc(store!, STORE_COLLECTIONS.CHANNELS, 'n5KE8KBMG04Jbt9D6DC0');
    // await updateDoc(tempBan, {
    //   banned: [{ uid: user?.uid!, photoURL: user?.photoURL!, displayName: user?.displayName! }],
    // });
  };

  return (
    <Modal
      transition="fade"
      transitionDuration={600}
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
          {filteredChannels?.map(channel => (
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
                  channel.admissionRequests?.some(existingUser => existingUser?.uid === user?.uid)
                    ? 'lime'
                    : 'cyan'
                }
                onClick={() => handleRequestChannelAccess(channel.id!)}
              />
            </Box>
          ))}
        </Stack>
      </div>
    </Modal>
  );
}