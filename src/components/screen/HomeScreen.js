import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Title, Paragraph } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/connectionFirebase'; // Importar 'auth'

// Recebemos a prop 'setUser' que veio do App.js -> Menu.js
export default function HomeScreen({ setUser }) {
    const user = auth.currentUser; // Pegar o usuário logado atualmente

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Ao deslogar do Firebase, limpamos o estado no App.js
            setUser(''); 
        }).catch((error) => {
            console.error("Erro ao fazer logout: ", error);
        });
    };

    return (
        <View style={styles.container}>
            <Title>Bem-vindo!</Title>
            <Paragraph style={styles.email}>
                {user ? `Logado como: ${user.email}` : 'Não logado'}
            </Paragraph>
            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                icon="logout"
            >
                Sair (Logout)
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    email: {
        fontSize: 16,
        marginVertical: 20,
    },
    button: {
        marginTop: 10,
        width: '80%',
    }
});
