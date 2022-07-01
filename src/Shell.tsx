import { useEffect, useState } from 'react';

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
import { useAtomValue } from 'jotai';
import { ToastContainer } from 'react-toastify';
import { Search, SquarePlus } from 'tabler-icons-react';
import SignIn from './components/SignIn/SignIn';
import SignOutUserAccordionItem from './components/SignOutAccordionItem/SignOutAccordionItem';
import ChannelStack, { selectedChannelAtom } from './features/Channels/ChannelStack/ChannelStack';
import CreateChannelModal from './features/Channels/CreateChannelModal/CreateChannelModal';
import SearchChannelsModal from './features/Channels/SearchChannelsModal/SearchChannelsModal';
import useFirebase from './providers/useFirebase';
import ChannelOptions from './features/Channels/ChannelOptions/ChannelOptions';
import Chatroom from './features/Chatroom/Chatroom';
import ChannelMembers from './features/Channels/ChannelMembers/ChannelMembers';

import 'react-toastify/dist/ReactToastify.css';

export default function Shell() {
  const { user } = useFirebase();

  const theme = useMantineTheme();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isCreateChannelOpened, setIsCreateChannelOpened] = useState(false);
  const [isSearchChannelsOpened, setIsSearchChannelsOpened] = useState(false);

  const selectedChannel = useAtomValue(selectedChannelAtom);

  if (!user) {
    return (
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

  return (
    <>
      <ToastContainer />
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
            background: theme.colors.dark[8],
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
              <Text weight="bold" size="xl" color="orange">
                Firechat
              </Text>
            </div>
          </Header>
        }
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!isSidebarOpened}
            width={{ sm: 200, lg: 300 }}>
            <Navbar.Section grow mt="xs" style={{ overflow: 'auto' }} mb="xs">
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
              <SignOutUserAccordionItem />
            </Navbar.Section>
          </Navbar>
        }
        aside={
          selectedChannel ? (
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Aside
                p="md"
                hiddenBreakpoint="sm"
                width={{ sm: 200, lg: 300 }}
                style={{ justifyContent: 'space-between' }}>
                <ChannelMembers />
                <ChannelOptions />
              </Aside>
            </MediaQuery>
          ) : (
            <></>
          )
        }>
        {selectedChannel ? <Chatroom selectedChannel={selectedChannel} /> : null}
      </AppShell>
    </>
  );
}
