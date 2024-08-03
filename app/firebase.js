// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGOBwpdPAwgt5I53f-WOhs7kb2jzBwmpc",
  authDomain: "inventory-management-6a239.firebaseapp.com",
  projectId: "inventory-management-6a239",
  storageBucket: "inventory-management-6a239.appspot.com",
  messagingSenderId: "716128797831",
  appId: "1:716128797831:web:0f01b60fa926999fa0a422",
  measurementId: "G-ZSHLCRBR2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export { firestore };