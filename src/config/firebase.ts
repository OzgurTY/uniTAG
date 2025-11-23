import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// BURAYA KENDİ FİREBASE BİLGİLERİNİ YAPIŞTIR
const firebaseConfig = {
  apiKey: "AIzaSyB7wl5tdecMjjugk35BAriAW8yn206g0Mw",
  authDomain: "unitag-bccda.firebaseapp.com",
  projectId: "unitag-bccda",
  storageBucket: "unitag-bccda.firebasestorage.app",
  messagingSenderId: "688059311436",
  appId: "1:688059311436:web:38b23d249b5cacaf5d1be9",
  measurementId: "G-7092Z7KY0F"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);