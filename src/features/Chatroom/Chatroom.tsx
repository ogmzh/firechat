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
import { getHotkeyHandler, useInputState, useIntersection } from '@mantine/hooks';
import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect, useRef } from 'react';
import useFirebase from '../../providers/useFirebase';
import usePaginatedMessages, {
  DEFAULT_PAGE_SIZE,
} from '../../services/firebase/messages/useMessages';
import { ChannelEntity, ChatType } from '../../shared/Types';
import { selectedTabAtom } from '../Channels/ChannelMembers/ChannelMembers';
import { selectedUserAtom } from '../Channels/ChannelStack/ChannelStack';

export default function Chatroom({ selectedChannel }: { selectedChannel: ChannelEntity }) {
  const [messageInput, setMessageInput] = useInputState('');

  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom);
  const selectedUser = useAtomValue(selectedUserAtom);
  const scrollToRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { sendMessage, messages, loadMore, hasMore, isLoading } = usePaginatedMessages(
    selectedChannel.id!,
    selectedTab,
    selectedUser
  );

  const [loadMoreRef, observedEntry] = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (observedEntry?.isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [observedEntry?.isIntersecting, hasMore, isLoading]);

  const { user } = useFirebase();

  useEffect(() => {
    if (messages.length <= DEFAULT_PAGE_SIZE) {
      scrollToRef.current?.scrollIntoView(); // initially scroll to last
    }
  }, [messages]);

  const handleSendMessage = async () => {
    setMessageInput('');
    await sendMessage(messageInput);
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' }); // initially scroll to last
  };

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
      <Stack
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyItems: 'flex-start',
          height: '100%',
        }}>
        <ScrollArea offsetScrollbars style={{ height: '75vh' }} ref={containerRef}>
          <Stack
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
            }}>
            {messages.map((message, index) => (
              <Group
                key={message.id}
                align="flex-end"
                style={{
                  flexDirection: `${message.author?.uid === user?.uid ? 'row-reverse' : 'row'}`,
                }}>
                <Avatar src={message.author?.photoURL ?? ''} radius="xl" />
                <Text
                  ref={index % 10 === 0 ? loadMoreRef : undefined}
                  sx={theme => ({
                    flex: selectedTab === 'announcements' || selectedTab === 'anonymous' ? 1 : 0.75,
                    padding: theme.spacing.xl,
                    borderRadius: theme.spacing.sm,
                    backgroundColor:
                      message.author?.uid === user?.uid
                        ? theme.colors.dark[6]
                        : theme.colors.dark[7],
                  })}>
                  {message.text}
                </Text>
              </Group>
            ))}
          </Stack>
          <div ref={scrollToRef} />
        </ScrollArea>
      </Stack>

      <Stack
        hidden={
          (selectedTab === 'announcements' && selectedChannel.admin.uid !== user?.uid) ||
          (selectedTab === '1-on-1' && !selectedUser)
        }>
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
