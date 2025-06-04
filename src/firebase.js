// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWTs57Wxr3rHdb86K0rp9aP7UWO_coq1M",
  authDomain: "fortune-room.firebaseapp.com",
  projectId: "fortune-room",
  storageBucket: "fortune-room.firebasestorage.app",
  messagingSenderId: "726996681375",
  appId: "1:726996681375:web:31283c393b5bcec6b858aa",
  measurementId: "G-18L5RE38XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB instance export
export const db = getFirestore(app);