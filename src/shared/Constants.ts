import { MantineTheme } from '@mantine/core';
import { ToastOptions } from 'react-toastify';

export const STORE_COLLECTIONS = {
  CHANNELS: 'channels',
  MESSAGES: 'messages',
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
