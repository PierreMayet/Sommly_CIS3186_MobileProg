
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNbK1qmZccSxpJ08vooVHVbdaOwl550KI",
  authDomain: "sommlyapp-cis3186.firebaseapp.com",
  projectId: "sommlyapp-cis3186",
  storageBucket: "sommlyapp-cis3186.firebasestorage.app",
  messagingSenderId: "497106343456",
  appId: "1:497106343456:web:f927d7089c1c1ba630ce45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };