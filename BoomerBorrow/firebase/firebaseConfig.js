// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV9mliZv0BhHUzmMTiKAU0rk0h3U1_h5Y",
  authDomain: "boomerborrow.firebaseapp.com",
  projectId: "boomerborrow",
  storageBucket: "boomerborrow.firebasestorage.app",
  messagingSenderId: "44181006796",
  appId: "1:44181006796:web:f0062292afc8a25e555569"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);