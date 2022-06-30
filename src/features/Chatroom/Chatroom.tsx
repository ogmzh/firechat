import { Button, Group, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { getHotkeyHandler, useInputState } from '@mantine/hooks';
import { ChangeEvent, useRef, useState } from 'react';
import useMessages from '../../services/firebase/messages/useMessages';
import { ChannelEntity, ChatType } from '../../shared/Types';

export default function Chatroom({ selectedChannel }: { selectedChannel: ChannelEntity }) {
  const [messageInput, setMessageInput] = useInputState('');

  const [selectedTab, setSelectedTab] = useState<ChatType>('public');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages(selectedChannel.id!, selectedTab);

  const handleSendMessage = async () => {
    await sendMessage(messageInput);
    setMessageInput('');
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <Stack style={{ height: '100%', justifyContent: 'space-between' }}>
      <Group>
        <SegmentedControl
          style={{ flex: 1 }}
          color="orange"
          size="lg"
          value={selectedTab}
          onChange={value => setSelectedTab(value as ChatType)}
          data={[
            { label: 'Public', value: 'public' },
            { label: 'Announcements', value: 'announcements' },
            { label: 'Private', value: 'private' },
            { label: '1 on 1', value: '1-on-1' },
          ]}
        />
      </Group>
      <Stack>
        {messages?.map(message => (
          <Text key={message.id}>{message.text}</Text>
        ))}
      </Stack>
      <Stack>
        <Group style={{ marginBottom: '-10px' }}>
          <TextInput
            style={{ flex: 1 }}
            value={messageInput}
            onKeyDown={getHotkeyHandler([['Enter', handleSendMessage]])}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
          />
          <Button onClick={() => handleSendMessage()}>Send</Button>
        </Group>
        <div ref={scrollToRef} />
      </Stack>
    </Stack>
  );
}
