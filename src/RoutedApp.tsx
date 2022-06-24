import { useState } from 'react';

import {
  AppShell,
  Aside,
  Box,
  Burger,
  Button,
  Container,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { SquarePlus } from 'tabler-icons-react';
import CreateChannelModal from './components/CreateChannelModal/CreateChannelModal';
import SignIn from './components/SignIn/SignIn';
import UserAvatar from './components/UserAvatar/UserAvatar';
import useFirebase from './providers/useFirebase';

export default function RoutedApp() {
  const { user } = useFirebase();

  const theme = useMantineTheme();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isCreateChannelOpened, setIsCreateChannelOpened] = useState(false);

  return user ? (
    <>
      <CreateChannelModal
        isCreateChannelOpened={isCreateChannelOpened}
        setIsCreateChannelOpened={setIsCreateChannelOpened}
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
                <SquarePlus
                  size={32}
                  cursor="pointer"
                  onClick={() => setIsCreateChannelOpened(true)}
                />
              </Group>
              <Stack mt="lg" spacing="sm">
                <Box
                  sx={theme => ({
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    textAlign: 'center',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    cursor: 'pointer',

                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    },
                  })}>
                  <Text>swolo</Text>
                </Box>
                <Box
                  sx={theme => ({
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    textAlign: 'center',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    cursor: 'pointer',

                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    },
                  })}>
                  <Text>yolo</Text>
                </Box>
                <Box
                  sx={theme => ({
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    textAlign: 'center',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    cursor: 'pointer',

                    '&:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    },
                  })}>
                  <Text>lolo</Text>
                </Box>
              </Stack>
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
