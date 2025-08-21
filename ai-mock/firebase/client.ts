// Import the functions you need from the SDKs you need
import { initializeApp , getApp, getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXUhxLpMMohzuRp4WsFNAHViIYuUONvoc",
  authDomain: "mockwise-4aa1b.firebaseapp.com",
  projectId: "mockwise-4aa1b",
  storageBucket: "mockwise-4aa1b.firebasestorage.app",
  messagingSenderId: "65225369779",
  appId: "1:65225369779:web:75918d0e5f3e5b34dc68c6",
  measurementId: "G-WW72CJ5P00"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)
