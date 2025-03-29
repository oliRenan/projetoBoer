import firebase from './connectionFirebase.js';

export function authenticateUser(email, password, type){
    return new Promise((resolve, reject) => {
        if (type === 'login') {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    console.log('Usuário autenticado na promisse:', user);
                    resolve(user);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    resolve(user);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
} 
