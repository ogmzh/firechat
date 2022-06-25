import { useState } from 'react';

import {
  AppShell,
  Aside,
  Box,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { Search, SquarePlus } from 'tabler-icons-react';
import ChannelStack, { selectedChannelAtom } from './components/ChannelStack/ChannelStack';
import CreateChannelModal from './components/CreateChannelModal/CreateChannelModal';
import SignIn from './components/SignIn/SignIn';
import UserAvatar from './components/UserAvatar/UserAvatar';
import useFirebase from './providers/useFirebase';
import { useAtomValue } from 'jotai';
import SearchChannelsModal from './components/SearchChannelsModal/SearchChannelsModal';

export default function Shell() {
  const { user } = useFirebase();

  const theme = useMantineTheme();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isCreateChannelOpened, setIsCreateChannelOpened] = useState(false);
  const [isSearchChannelsOpened, setIsSearchChannelsOpened] = useState(false);

  const selectedChannel = useAtomValue(selectedChannelAtom);

  return user ? (
    <>
      <CreateChannelModal
        isModalOpen={isCreateChannelOpened}
        setIsModalOpen={setIsCreateChannelOpened}
      />
      <SearchChannelsModal
        isModalOpen={isSearchChannelsOpened}
        setIsModalOpen={setIsSearchChannelsOpened}
      />
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        header={
          <Header height={70} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={isSidebarOpened}
                  onClick={() => setIsSidebarOpened(o => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text weight={700}>Firechat</Text>
            </div>
          </Header>
        }
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!isSidebarOpened}
            width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow mt="xs">
              <Group sx={{ justifyContent: 'space-between' }}>
                <Text>Channels</Text>
                <div>
                  <SquarePlus
                    style={{ marginRight: '10px' }}
                    size={32}
                    cursor="pointer"
                    onClick={() => setIsCreateChannelOpened(true)}
                  />
                  <Search
                    size={32}
                    cursor="pointer"
                    onClick={() => setIsSearchChannelsOpened(true)}
                  />
                </div>
              </Group>
              <ChannelStack mt="lg" spacing="sm" />
            </Navbar.Section>
            <Navbar.Section>
              <UserAvatar />
            </Navbar.Section>
          </Navbar>
        }
        aside={
          selectedChannel ? (
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                <Text>Membersq</Text>
              </Aside>
            </MediaQuery>
          ) : (
            <></>
          )
        }>
        <Text>
          {selectedChannel ? selectedChannel.name : 'Resize app to see responsive navbar in action'}
        </Text>
      </AppShell>
    </>
  ) : (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box style={{ width: 400 }}>
        <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Text weight={700} size="xl" mb="20px">
            Firechat
          </Text>
          <SignIn />
        </Box>
      </Box>
    </Box>
  );
}
