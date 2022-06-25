export type MessageEntity = {
  id: string;
  text: string;
  author: UserProfile;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type ChannelPrivacy = 'private' | 'public';

export type UserProfile = { uid: string; photoURL: string; displayName: string };

export type ChannelEntity = {
  id?: string;
  admin: UserProfile;
  banned: UserProfile[];
  members: UserProfile[];
  name: string;
  privacy: ChannelPrivacy;
  admissionRequests: string[];
  messages: MessageEntity[];
};

export type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};
