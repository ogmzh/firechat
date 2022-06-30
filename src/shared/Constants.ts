import { MantineTheme } from '@mantine/core';
import { ToastOptions } from 'react-toastify';

export const STORE_COLLECTIONS = {
  CHANNELS: {
    ROOT: 'channels',
    ADMISSION_REQUESTS: 'requests',
    MEMBERS: 'members',
    BANS: 'bans',
    MESSAGES: 'messages',
    CHAT_ROOM: 'chatroom',
  },
  USERS: {
    ROOT: 'users',
    CHANNELS: 'channels',
  },
};

export const getToastifyProps = (mantineTheme: MantineTheme): ToastOptions => ({
  position: 'bottom-right',
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    backgroundColor: mantineTheme.colors.dark[7],
    color: mantineTheme.colors.dark[0],
    fontFamily: mantineTheme.fontFamily,
  },
});
