import { ChangeEvent, useRef } from 'react';
import { Button, Group, Text, Stack, TextInput } from '@mantine/core';
import { getHotkeyHandler, useInputState } from '@mantine/hooks';
import { ChannelEntity } from '../../shared/Types';
import useMessages from '../../services/firebase/messages/useMessages';

export default function Chatroom({ selectedChannel }: { selectedChannel: ChannelEntity }) {
  const [messageInput, setMessageInput] = useInputState('');
  const scrollToRef = useRef<HTMLDivElement>(null);

  // const { messages, sendMessage } = useMessages(selectedChannel.id!);

  const handleSendMessage = async () => {
    // await sendMessage(messageInput);
    setMessageInput('');
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <Stack style={{ height: '100%', justifyContent: 'space-between' }}>
      <Stack>
        {/* {messages?.map(message => (
          <Text key={message.id}>{message.text}</Text>
        ))} */}
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
