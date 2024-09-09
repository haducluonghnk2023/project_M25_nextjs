// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.DB_FIREBASE,
  authDomain: "m25-project-e7165.firebaseapp.com",
  projectId: "m25-project-e7165",
  storageBucket: "m25-project-e7165.appspot.com",
  messagingSenderId: "1001949564180",
  appId: "1:1001949564180:web:190bff03b8f58b96bfc601",
  measurementId: "G-QGME6VHPZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app)

