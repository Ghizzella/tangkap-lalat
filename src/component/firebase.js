// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDXaT6qVduVfPRP3EyGV4QCAmxnT7wMqpw",
  authDomain: "tangkap-lalat.firebaseapp.com",
  projectId: "tangkap-lalat",
  storageBucket: "tangkap-lalat.firebasestorage.app",
  messagingSenderId: "96401929835",
  appId: "1:96401929835:web:a04f5397b3d073692a632e",
  measurementId: "G-FG3FW48V9W"
};

// 🔥 Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// 📊 Opsional: Analytics
const analytics = getAnalytics(app);

// ✅ Auth & Firestore Export
export const auth = getAuth(app);
export const db = getFirestore(app);
