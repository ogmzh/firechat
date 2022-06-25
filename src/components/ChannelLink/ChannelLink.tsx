import { Box, Text } from '@mantine/core';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { ChannelEntity } from '../../shared/Types';
import { selectedChannelAtom } from '../ChannelStack/ChannelStack';

const ChannelLink: FC<{ channel: ChannelEntity }> = props => {
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const { channel } = props;
  return (
    <Box
      onClick={() => setSelectedChannel(channel)}
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
      <Text lineClamp={1} title={channel.name}>
        {channel.name}
      </Text>
    </Box>
  );
};

export default ChannelLink;
