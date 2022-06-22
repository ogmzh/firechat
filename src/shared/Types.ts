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
