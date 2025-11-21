// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7wl5tdecMjjugk35BAriAW8yn206g0Mw",
  authDomain: "unitag-bccda.firebaseapp.com",
  projectId: "unitag-bccda",
  storageBucket: "unitag-bccda.firebasestorage.app",
  messagingSenderId: "688059311436",
  appId: "1:688059311436:web:38b23d249b5cacaf5d1be9",
  measurementId: "G-7092Z7KY0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);