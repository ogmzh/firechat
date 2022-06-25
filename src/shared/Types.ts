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

export type ChannelPrivacy = 'private' | 'public';

export type ChannelEntity = {
  id: string;
  admin: string;
  banned: { uid: string; photoURL: string; displayName: string }[];
  members: User[];
  name: string;
  privacy: ChannelPrivacy;
  admissionRequests: string[];
};

export type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};
