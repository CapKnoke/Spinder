import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';

export type FirestoreUser = {
  name: string;
  gender: string;
};

export type FirestoreMatch = {
  matchedUserIds: string[];
  matchedUsers: { [k: string]: FirestoreUser };
  seenByIds: string[];
  lastMessage?: ChatMessage;
  createdAt: Timestamp;
};

export type ChatMessage = {
  senderId: string;
  message: string;
  seen: boolean;
  seenAt: Timestamp | null;
  createdAt: Timestamp;
};
