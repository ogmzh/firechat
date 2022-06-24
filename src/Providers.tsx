import { MantineProvider } from '@mantine/core';
import FirebaseProvider from './providers/FirebaseProvider';
import RoutedApp from './RoutedApp';

export default function Providers() {
  return (
    <>
      <MantineProvider
        theme={{
          fontFamily: 'Nunito Sans, sans-serif',
          primaryColor: 'violet',
          colorScheme: 'dark',
          colors: {
            dark: [
              '#d5d7e0',
              '#acaebf',
              '#8c8fa3',
              '#666980',
              '#4d4f66',
              '#34354a',
              '#2b2c3d',
              '#1d1e30',
              '#0c0d21',
              '#01010a',
            ],
          },
        }}
        withGlobalStyles
        withNormalizeCSS>
        <FirebaseProvider>
          <RoutedApp />
        </FirebaseProvider>
      </MantineProvider>
    </>
  );
}
