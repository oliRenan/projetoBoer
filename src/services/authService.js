import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
// Importa a instância 'auth' específica do nosso arquivo de conexão
import { auth } from './connectionFirebase.js'; 

export function authenticateUser(email, password, type) {
    return new Promise((resolve, reject) => {
        if (type === 'login') {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // O usuário está em userCredential.user
                    console.log('Usuário autenticado na promisse:', userCredential.user);
                    resolve(userCredential); // Resolve com a credencial completa
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    resolve(userCredential);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}
