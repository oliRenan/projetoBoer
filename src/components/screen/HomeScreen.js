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
            <Title style={[styles.title, { color: colors.onBackground }]}>Olá!</Title>
            <Text variant="bodyLarge" style={[styles.email, { color: colors.onSurfaceVariant }]}>
                {user ? `Você está logado como: ${user.email}` : 'Não logado'}
            </Text>
            
            <Button
                mode="contained"
                onPress={handleLogout}
                style={[styles.button, { backgroundColor: colors.primary }]} 
                textColor={colors.onPrimary} 
                icon="logout"
            >
                Sair
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
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        marginVertical: 20,
        textAlign: 'center',
        paddingHorizontal: 10, 
    },
    button: {
        marginTop: 20,
        width: '80%', 
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
    }
});
