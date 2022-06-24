import { useState } from 'react';

import useFirebase from './providers/useFirebase';

import {
  AppShell,
  Aside,
  Box,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from '@mantine/core';
import SignIn from './components/SignIn/SignIn';
import UserAvatar from './components/UserAvatar/UserAvatar';

export default function RoutedApp() {
  const { user } = useFirebase();

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
