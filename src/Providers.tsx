import FirebaseProvider from './providers/FirebaseProvider';
import RoutedApp from './RoutedApp';

export default function Providers() {
  return (
    <FirebaseProvider>
      <RoutedApp />
    </FirebaseProvider>
  );
}
