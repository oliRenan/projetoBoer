import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, Text, TextInput, useTheme } from "react-native-paper";
import { authenticateUser } from '../services/authService.js';
import Toast from 'react-native-toast-message';

export default function Login({ changeStatus }) {
    const { colors } = useTheme(); // 2. Pegar as cores do tema
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('login');
    
    const notify = (message) => {
        Toast.show({
            type: 'error', 
            text1: message,
            position: 'bottom',
            visibilityTime: 2000,
        });
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

        setLoading(true)
        authenticateUser(email, password, type)
            .then((data) => {
                changeStatus(data.user.uid);
                Toast.show({
                    type: 'success',
                    text1: type === 'login' ? 'Login bem-sucedido!' : 'Cadastrado com sucesso',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: type === 'login' ? 'E-mail ou senha não cadastrados!' : 'Erro ao Cadastrar!',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            })
            .finally(() => setLoading(false) );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Image style={styles.logo} source={require("../../assets/logoo.png")} />
            
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
                <Card.Title 
                    title="BEM-VINDO" 
                    titleStyle={{ color: colors.primary }} // Roxo
                />
                <Card.Content>
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="E-mail"
                        value={email}
                        activeOutlineColor={colors.primary} // Roxo
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="Senha"
                        secureTextEntry
                        maxLength={30}
                        value={password}
                        activeOutlineColor={colors.primary} // Roxo
                        onChangeText={(text) => setPassword(text)}
                    />
                </Card.Content>
            </Card>
 
            <TouchableOpacity
                style={[
                    styles.handleLogin,
                    { backgroundColor: type === "login" ? colors.primary : colors.accent }, 
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.loginText}>
                    {type === "login" ? "Acessar" : "Cadastrar"}
                </Text>
            </TouchableOpacity>
 
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}
            
            <TouchableOpacity
                onPress={() =>
                    setType((type) => (type === "login" ? "cadastrar" : "login"))
                }
            >
                <Text style={styles.toggleText}>
                    {type === "login" ? "Criar uma conta" : "Já possuo uma conta"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
 
// 6. Atualizar os Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", 
        textAlign: "center",
        padding: 18,
    },
    logo: {
        width: 150, 
        height: 150,
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 20, 
    },
    label: {
        marginBottom: 10,
    },
    loginText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 'bold',
    },
    handleLogin: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        marginTop: 20,
        borderRadius : 8, 
        width: '100%', 
    },
    card:{
        borderRadius: 12, 
        padding: 10,
    },
    toggleText: {
        textAlign: "center", 
        fontSize: 16, 
        marginTop: 20,
        fontWeight: 'bold',
        color: '#00BCD4' 
    }
});
