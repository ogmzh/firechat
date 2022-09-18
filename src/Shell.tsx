import React, { HtmlHTMLAttributes, useState } from 'react';

import {
  AppShell,
  Aside,
  Box,
  Burger,
  Button,
  Group,
  Header,
  Input,
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
import ChannelMembers from './features/Channels/ChannelMembers/ChannelMembers';
import ChannelOptions from './features/Channels/ChannelOptions/ChannelOptions';
import ChannelStack, { selectedChannelAtom } from './features/Channels/ChannelStack/ChannelStack';
import CreateChannelModal from './features/Channels/CreateChannelModal/CreateChannelModal';
import SearchChannelsModal from './features/Channels/SearchChannelsModal/SearchChannelsModal';
import Chatroom from './features/Chatroom/Chatroom';
import useFirebase from './providers/useFirebase';
import 'react-toastify/dist/ReactToastify.css';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function Shell() {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState(0);
  const { user, storage } = useFirebase();

  const theme = useMantineTheme();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isCreateChannelOpened, setIsCreateChannelOpened] = useState(false);
  const [isSearchChannelsOpened, setIsSearchChannelsOpened] = useState(false);

  const selectedChannel = useAtomValue(selectedChannelAtom);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files?.[0] ?? null);

  const upload = () => {
    if (file) {
      // step 1: write the message object in firestore with maybe empty text? doesnt matter
      // step 2: upload file
      // step 3: uploaded file shall be processed by the firestore FN and resource field will be appended to the document provided
      // through the customMetadata
      const storageRef = ref(storage!, `/files/${user?.uid}/assets/upload/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: {
          messageOrigin:
            '/channels/PQK7jVgIDoeJakfP7Mq4/chatroom/public/messages/05kSWSeURr2RTACKsqd4',
        },
      });
      uploadTask.on(
        'state_changed',
        snapshot => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          // update progress
          setPercent(percent);
        },
        error => console.log(error),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(url => {
            console.log(url);
            setFile(null);
          });
        }
      );
    }
  };

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
              Firechat!
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
                Firechat!
              </Text>
              <Group spacing="md" ml={10}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleImageUpload(event)
                  }
                />
                <Button onClick={upload} disabled={!file}>
                  Upload to Fire Storage
                </Button>
                <Text style={{ marginLeft: '10px' }}>{percent}%</Text>
              </Group>
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
