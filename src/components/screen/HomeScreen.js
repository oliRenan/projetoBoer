import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Title, Text, useTheme } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/connectionFirebase';

export default function HomeScreen({ setUser }) {
    const { colors } = useTheme();
    const user = auth.currentUser; 

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUser(''); 
        }).catch((error) => {
            console.error("Erro ao fazer logout: ", error);
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            
            <Image 
                style={styles.logo} 
                source={require('../../../assets/logoo.png')} 
            />

            <Title style={styles.title}>Bem-vindo!</Title>
            <Text variant="bodyLarge" style={styles.email}>
                {user ? `Logado como: ${user.email}` : 'Não logado'}
            </Text>
            
            <Button
                mode="contained"
                onPress={handleLogout}
                style={[styles.button, { backgroundColor: colors.accent }]} 
                textColor={colors.background}
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
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        marginBottom: 10,
    },
    email: {
        fontSize: 16,
        marginVertical: 20,
    },
    button: {
        marginTop: 10,
        width: '90%', 
        borderRadius: 8,
    }
});
