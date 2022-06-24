import { useContext } from 'react';
import { FirebaseContext, FirebaseProps } from './FirebaseProvider';

const useFirebase = (): Partial<Omit<FirebaseProps, 'children'>> => {
  const firebaseContext = useContext(FirebaseContext);
  return {
    app: firebaseContext?.app,
    store: firebaseContext?.store,
    user: firebaseContext?.user,
    auth: firebaseContext?.auth,
  };
};

export default useFirebase;
