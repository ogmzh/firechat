import { Box, Text } from '@mantine/core';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { ChannelEntity } from '../../shared/Types';
import { selectedChannelAtom } from '../../features/Channels/ChannelStack/ChannelStack';
import { useOwnChannel } from '../../services/firebase/channels/useOwnChannels';

const ChannelLink: FC<{ channel: ChannelEntity }> = props => {
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const { channel } = props;

  // fill the admin data etc from channel document
  const { selectedChannel: selectedChannelFresh } = useOwnChannel(channel);

  const handleClickLink = () => {
    setSelectedChannel(selectedChannelFresh);
  };
  return (
    <Box
      onClick={() => handleClickLink()}
      sx={theme => ({
        backgroundColor:
          selectedChannel?.id === channel.id ? theme.colors.dark[4] : theme.colors.dark[6],

        textAlign: 'center',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.colors.dark[5],
        },
      })}>
      <Text
        lineClamp={1}
        title={channel.name}
        weight={selectedChannel?.id === channel.id ? 'bold' : 'regular'}
        color={selectedChannel?.id === channel.id ? 'orange' : 'inherit'}>
        {channel.name}
      </Text>
    </Box>
  );
};

export default ChannelLink;
