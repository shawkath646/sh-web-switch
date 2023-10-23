import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWvqDvd-_3tf4Pw-aHdgxk3zKB6CM-xec",
  authDomain: "sh-web-switch.firebaseapp.com",
  projectId: "sh-web-switch",
  storageBucket: "sh-web-switch.appspot.com",
  messagingSenderId: "717550737784",
  appId: "1:717550737784:web:40ffcb6a76c0a8e4c3108d"
};

const app = !getApps().length > 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage();

export { app, db, storage };