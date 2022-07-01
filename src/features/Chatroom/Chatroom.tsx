import {
  Avatar,
  Button,
  Group,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { getHotkeyHandler, useInputState } from '@mantine/hooks';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useFirebase from '../../providers/useFirebase';
import useMessages from '../../services/firebase/messages/useMessages';
import { ChannelEntity, ChatType } from '../../shared/Types';

export default function Chatroom({ selectedChannel }: { selectedChannel: ChannelEntity }) {
  const [messageInput, setMessageInput] = useInputState('');

  const [selectedTab, setSelectedTab] = useState<ChatType>('public');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages(selectedChannel.id!, selectedTab);
  const { user } = useFirebase();
  const handleSendMessage = async () => {
    await sendMessage(messageInput);
    setMessageInput('');
  };

  useEffect(() => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Stack style={{ height: '100%', justifyContent: 'space-between' }}>
      <Group>
        <SegmentedControl
          style={{ flex: 1, position: 'sticky' }}
          color="orange"
          size="lg"
          value={selectedTab}
          onChange={value => setSelectedTab(value as ChatType)}
          data={[
            { label: 'Public', value: 'public' },
            { label: 'Announcements', value: 'announcements' },
            { label: 'Anonymous', value: 'anonymous' },
            { label: '1 on 1', value: '1-on-1' },
          ]}
        />
      </Group>
      <ScrollArea style={{ height: '80vh' }}>
        <Stack>
          {messages?.map(message => (
            <Group
              key={message.id}
              align="flex-end"
              style={{
                flexDirection: `${message.author?.uid === user?.uid ? 'row-reverse' : 'row'}`,
              }}>
              <Avatar src={message.author?.photoURL ?? ''} radius="xl" />
              <Text
                sx={theme => ({
                  flex: selectedTab === 'announcements' || selectedTab === 'anonymous' ? 1 : 0.75,
                  padding: theme.spacing.xl,
                  borderRadius: theme.spacing.sm,
                  backgroundColor:
                    message.author?.uid === user?.uid ? theme.colors.dark[6] : theme.colors.dark[7],
                })}>
                {message.text}
              </Text>
            </Group>
          ))}
        </Stack>
        <div ref={scrollToRef} />
      </ScrollArea>

      <Stack hidden={selectedTab === 'announcements' && selectedChannel.admin.uid !== user?.uid}>
        <Group>
          <TextInput
            style={{ flex: 1 }}
            value={messageInput}
            onKeyDown={getHotkeyHandler([['Enter', handleSendMessage]])}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
          />
          <Button onClick={() => handleSendMessage()}>Send</Button>
        </Group>
      </Stack>
    </Stack>
  );
}
