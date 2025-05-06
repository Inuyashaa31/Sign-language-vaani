// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJDTIMnuuA3ASoSW2gN4PtFDCOU4exLtA",
  authDomain: "focus-apptest1.firebaseapp.com",
  projectId: "focus-apptest1",
  storageBucket: "focus-apptest1.firebasestorage.app",
  messagingSenderId: "215559873964",
  appId: "1:215559873964:web:2d9130ad12cab6fd820609",
  measurementId: "G-82MHPX1Y2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };