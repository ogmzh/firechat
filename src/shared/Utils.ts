import { User } from 'firebase/auth';
import { UserProfile } from './Types';

export const authUserToProfile = (user: User): UserProfile => ({
  uid: user.uid,
  displayName: user.displayName!, // these two null coercions might be dangerous
  photoURL: user.photoURL!,
  email: user.email!,
});
