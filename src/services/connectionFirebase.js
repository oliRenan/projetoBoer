import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics"; // Opcional, se for usar

// Sua nova configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAAi0OvJ9iEfQZSyuz7gAV15RxfRqYjXI",
  authDomain: "projetomobilenovo.firebaseapp.com",
  projectId: "projetomobilenovo",
  storageBucket: "projetomobilenovo.firebasestorage.app",
  messagingSenderId: "686289480771",
  appId: "1:686289480771:web:73b8c0d07d4369ea7078f6",
  measurementId: "G-FKNV8KLENX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vamos usar e os exporta
const auth = getAuth(app);
const database = getDatabase(app); // Seu app usa o Realtime Database
// const analytics = getAnalytics(app); // Descomente se for usar

export { app, auth, database };
