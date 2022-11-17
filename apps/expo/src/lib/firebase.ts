import { ChatMessage, FirestoreMatch, FirestoreUser } from '../types/firestore';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCUe0Cefrce2AIoM8nZVh1nZLomwuXZeFA',
  authDomain: 'tinder-clone-3817a.appspot.com',
  projectId: 'tinder-clone-3817a',
  storageBucket: 'tinder-clone-3817a.appspot.com',
  messagingSenderId: '892524085460',
  appId: '1:892524085460:android:f5f9d920819f3d62cdfb41',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

const converter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (user: T) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return snapshot.data() as T;
  },
});

const dataPoint = <T extends DocumentData>(collectionPath: string, ...pathSegments: string[]) =>
  collection(firestore, collectionPath, ...pathSegments).withConverter(converter<T>());

const db = {
  users: dataPoint<FirestoreUser>('users'),
  matches: dataPoint<FirestoreMatch>('matches'),
  messages: (matchId: string) => dataPoint<ChatMessage>('matches', matchId, 'messages'),
  user: (userId: string) => doc(dataPoint<FirestoreUser>('users'), userId),
  match: (matchId: string) => doc(dataPoint<FirestoreMatch>('matches'), matchId),
  message: (matchId: string, messageId: string) =>
    doc(dataPoint<ChatMessage>('matches', matchId, 'messages'), messageId),
};

export default db;
