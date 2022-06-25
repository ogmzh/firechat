import { Box, Text } from '@mantine/core';
import { FC } from 'react';
import { ChannelEntity } from '../../shared/Types';

const ChannelLink: FC<{ channel: ChannelEntity }> = props => {
  const { channel } = props;
  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}>
      <Text lineClamp={1} title={channel.name}>
        {channel.name}
      </Text>
    </Box>
  );
};

export default ChannelLink;
