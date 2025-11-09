import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Card, Text, TextInput, Button, useTheme } from "react-native-paper";
import { authenticateUser } from '../services/authService.js';
import Toast from 'react-native-toast-message';

export default function Login({ changeStatus }) {
    const { colors } = useTheme(); 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('login');
    
    const notify = (message, type = 'error') => {
        Toast.show({ type, text1: message, position: 'bottom', visibilityTime: 3000 });
    };   
     function handleLogin() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordConditions = [
            { regex: /^.{6,}$/, message: 'A senha deve ter no mínimo 6 caracteres' },
            { regex: /[a-zA-Z]/, message: 'A senha deve conter pelo menos uma letra' },
            { regex: /\d/, message: 'A senha deve conter pelo menos um número' },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'A senha deve conter pelo menos um símbolo' },
        ];

        if (!email) return notify('O campo de e-mail não pode estar vazio');
        if (!password) return notify('O campo de senha não pode estar vazio');
        if (!emailRegex.test(email)) return notify('Email inválido');
        for (const { regex, message } of  passwordConditions ){
            if (!regex.test(password)) return notify(message);
        }
        setLoading(true);
        authenticateUser(email, password, type)
            .then((data) => {
                changeStatus(data.user.uid);
                notify(type === 'login' ? 'Login bem-sucedido!' : 'Cadastrado com sucesso', 'success');
            })
            .catch((error) => {
                notify(type === 'login' ? 'E-mail ou senha inválidos.' : 'Erro ao Cadastrar: E-mail já em uso ou inválido.');
            })
            .finally(() => setLoading(false) );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.onBackground }]}>
                    {type === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
                </Text>
            </View>
            
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
                <Card.Content>
                    <TextInput
                        style={styles.input}
                        mode="outlined"
                        label="E-mail"
                        value={email}
                        activeOutlineColor={colors.primary}
                        outlineColor={colors.outline}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        mode="outlined"
                        label="Senha"
                        secureTextEntry
                        maxLength={30}
                        value={password}
                        activeOutlineColor={colors.primary}
                        outlineColor={colors.outline}
                        onChangeText={(text) => setPassword(text)}
                    />
                </Card.Content>
            </Card>
 
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={[styles.mainButton, { backgroundColor: colors.primary }]}
                labelStyle={styles.mainButtonText}
            >
                {type === "login" ? "Entrar" : "Cadastrar"}
            </Button>
 
            {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />}
            
            <Button
                mode="text"
                onPress={() => setType((type) => (type === "login" ? "cadastrar" : "login"))}
                style={styles.toggleButton}
                labelStyle={[styles.toggleButtonText, { color: colors.primary }]}
            >
                {type === "login" ? "Não tem uma conta? Cadastre-se!" : "Já tem uma conta? Faça login!"}
            </Button>
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card:{
        width: '100%',
        borderRadius: 12,
        padding: 10,
        elevation: 2, 
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    mainButton: {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 2,
    },
    mainButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    toggleButton: {
        marginTop: 25,
    },
    toggleButtonText: {
        fontSize: 15,
        fontWeight: '500',
    }
});
