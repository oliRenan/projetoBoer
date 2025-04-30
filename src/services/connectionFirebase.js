import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/database';


// const firebaseConfig = {
//   apiKey: "AIzaSyB_EJOBmswqCmJypMQMvrjWkeZU_NqF8MQ",
//   authDomain: "projetomobileoficial.firebaseapp.com",
//   projectId: "projetomobileoficial",
//   storageBucket: "projetomobileoficial.firebasestorage.app",
//   messagingSenderId: "298363989434",
//   appId: "1:298363989434:web:21f06c363388a0028f8183"
// };

const firebaseConfig = {
  apiKey: "AIzaSyARPcYKXEiAj-wyBxhtApl7V9bqbvDwypU",
  authDomain: "projetomobile2-b356b.firebaseapp.com",
  projectId: "projetomobile2-b356b",
  storageBucket: "projetomobile2-b356b.firebasestorage.app",
  messagingSenderId: "627327981156",
  appId: "1:627327981156:web:f5e90a8a8ba8008c4ab171",
  baseUrl : "https://projetomobile2-b356b-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
if (!firebase.apps.length) { 
    // Initialize Firebase 
    firebase.initializeApp(firebaseConfig); 
  }
   
  export default firebase

// const app = initializeApp(firebaseConfig);
// //const auth = getAuth(app)
