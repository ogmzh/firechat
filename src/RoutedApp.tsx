import { useState } from 'react';

import useFirebase from './providers/useFirebase';

import {
  AppShell,
  Aside,
  Box,
  Burger,
  Center,
  Container,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from '@mantine/core';
import UserAvatar from './components/UserAvatar/UserAvatar';
import SignIn from './components/SignIn/SignIn';

export default function RoutedApp() {
  const { user } = useFirebase();
  // <div>
  //   <Text>lmaochat</Text>
  //   <SignIn />
  //   {user && <Chatroom />}
  // </div>

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return user ? (
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
                opened={opened}
                onClick={() => setOpened(o => !o)}
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
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow mt="xs">
            <Text>Channels</Text>
          </Navbar.Section>
          <Navbar.Section>
            <UserAvatar />
          </Navbar.Section>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Members</Text>
          </Aside>
        </MediaQuery>
      }>
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  ) : (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box style={{ width: 400 }}>
        <SignIn />
      </Box>
    </Box>
  );
}
