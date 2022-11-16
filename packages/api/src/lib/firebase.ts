import { ServiceAccount } from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Match, MatchUser } from '../types/firestore';

const adminCredentials: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = initializeApp({
  credential: cert(adminCredentials),
});

export const firestore = getFirestore(app);

const converter = <
  T extends FirebaseFirestore.DocumentData
>(): FirebaseFirestore.FirestoreDataConverter<T> => ({
  toFirestore: (user: T) => user,
  fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
    return snapshot.data() as T;
  },
});

const dataPoint = <T extends FirebaseFirestore.DocumentData>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

const db = {
  users: dataPoint<MatchUser>('users'),
  matches: dataPoint<Match>('matches'),
};

export default db;
