// Firebase configuration and initialization
// Using Firebase config from firebase.txt

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
} from 'firebase/firestore';
import {
  getStorage,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVF6vz1RgFB51Q9b6Zb77H-dNOZrLqhsg",
  authDomain: "beautyproducts-285a5.firebaseapp.com",
  projectId: "beautyproducts-285a5",
  storageBucket: "beautyproducts-285a5.firebasestorage.app",
  messagingSenderId: "673318882675",
  appId: "1:673318882675:web:d71324ce8fe57c23ad0906",
  measurementId: "G-PB6XK9B3VM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

