import { serverTimestamp, SnapshotOptions } from 'firebase/firestore';

export const genericConverter = {
  toFirestore(post: any) {
    return { ...post, createdAt: serverTimestamp() };
  },
  fromFirestore(snapshot: any, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    };
  },
};
