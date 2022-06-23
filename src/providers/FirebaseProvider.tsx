import { FirebaseApp, getApp } from 'firebase/app';
import { Auth, getAuth, User } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { createContext, FC, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export interface FirebaseProps {
  app: FirebaseApp;
  user?: User | null;
  auth: Auth;
  store: Firestore;
  children?: ReactNode;
}

export const FirebaseContext = createContext<FirebaseProps | null>(null);

const appName = 'firechat';

const FirebaseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const app = getApp(appName);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const store = getFirestore(app);
  return (
    <FirebaseContext.Provider value={{ app, user, store, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
