import { User } from 'firebase/auth';

export type MessageEntity = {
  id: string;
  uid: string;
  text: string;
  photoURL: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type ChannelEntity = {
  id: string;
  admin: string;
  banned: User[];
  members: User[];
  name: string;
};
