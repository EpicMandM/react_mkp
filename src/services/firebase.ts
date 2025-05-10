import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCnKW_2OqySOjLAG9UAnliaNEpk7wQsKt8",
  authDomain: "react-mkp.firebaseapp.com",
  projectId: "react-mkp",
  storageBucket: "react-mkp.firebasestorage.app",
  messagingSenderId: "454114035153",
  appId: "1:454114035153:web:c5b4909072292a228c0cf0",
  measurementId: "G-JVQVSK2D94"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
