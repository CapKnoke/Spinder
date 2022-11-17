import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
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
export const db = getFirestore(app);

export const createCol = <T = DocumentData>(path: string, ...pathSegments: string[]) => {
  return collection(db, path, ...pathSegments) as CollectionReference<T>;
};
export const createDoc = <T = DocumentData>(path: string, ...pathSegments: string[]) => {
  return doc(db, path, ...pathSegments) as DocumentReference<T>;
};
