import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCUe0Cefrce2AIoM8nZVh1nZLomwuXZeFA',
  authDomain: 'tinder-clone-3817a.appspot.com',
  projectId: 'tinder-clone-3817a',
  storageBucket: 'tinder-clone-3817a.appspot.com',
  messagingSenderId: '892524085460',
  appId: '1:892524085460:android:f5f9d920819f3d62cdfb41',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
