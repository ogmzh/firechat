export type MessageEntity = {
  id?: string;
  text: string;
  author: UserProfile;
  channelId: string;
  createdAt?: any; // TODO: fix
};

export type ChannelPrivacy = 'private' | 'public';

export type UserProfile = {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
  channels?: ChannelEntity[];
  ownedChannels?: ChannelEntity[];
  admissionRequests?: ChannelEntity[];
  bans?: ChannelEntity[];
};

export type ChannelEntity = {
  id?: string;
  name: string;
  admin: UserProfile;
  privacy: ChannelPrivacy;
};

export type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};
