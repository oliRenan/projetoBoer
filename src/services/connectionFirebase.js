import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/database';


const firebaseConfig = {
  apiKey: "AIzaSyB_EJOBmswqCmJypMQMvrjWkeZU_NqF8MQ",
  authDomain: "projetomobileoficial.firebaseapp.com",
  projectId: "projetomobileoficial",
  storageBucket: "projetomobileoficial.firebasestorage.app",
  messagingSenderId: "298363989434",
  appId: "1:298363989434:web:21f06c363388a0028f8183"
};

// Initialize Firebase
if (!firebase.apps.length) { 
    // Initialize Firebase 
    firebase.initializeApp(firebaseConfig); 
  }
   
  export default firebase

// const app = initializeApp(firebaseConfig);
// //const auth = getAuth(app)
