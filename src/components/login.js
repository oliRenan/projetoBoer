import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity,ActivityIndicator } from "react-native";
import { Card, Text, TextInput , Dialog, Portal, Button} from "react-native-paper";
//import firebase from '../services/connectionFirebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { authenticateUser } from '../services/authService.js';

import Toast from 'react-native-toast-message';


export default function Login({changeStatus}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('login');
    const notify = (message) => {
        Toast.show({
            type: 'error', // ou 'success' dependendo do caso
            text1: message,
            position: 'bottom',
            visibilityTime: 2000,
        });
    };   

     function handleLogin() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//        const passwordRegex = /^.{6,}$/; 
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        
        const passwordConditions = [
            { regex: /^.{6,}$/, message: 'A senha deve ter no mínimo 6 caracteres' },
            { regex: /[a-zA-Z]/, message: 'A senha deve conter pelo menos uma letra' },
            { regex: /\d/, message: 'A senha deve conter pelo menos um número' },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'A senha deve conter pelo menos um símbolo' },
        ];

        if (!email) {
            return notify('O campo de e-mail não pode estar vazio');
        }
        if (!password) {
            return notify('O campo de senha não pode estar vazio');
        }
    
        if (!emailRegex.test(email)) {
            return notify('Email inválido');
        }

       for (const { regex, message } of  passwordConditions ){
            if (!regex.test(password)) {
                return notify(message);
            }
        }

    setLoading(true)
    authenticateUser(email, password, type)
        .then((data) => {
            console.log('Usuário autenticado:', data);
            changeStatus(data.user.uid);
            Toast.show({
                type: 'success',
                text1: type === 'login' ? 'Login bem-sucedido!' : 'Cadastrado com sucesso',
                position: 'bottom',
                visibilityTime: 3000,
            });
        })
        .catch((error) => {
            console.log('Erro:', error);
            Toast.show({
                type: 'error',
                text1: type === 'login' ? 'E-mail ou senha não cadastrados!' : 'Erro ao Cadastrar!',
                position: 'bottom',
                visibilityTime: 3000,
            });
        })
        .finally(() => {
            setLoading(false);
        });

    }
    return (
        <View style={styles.container}>
                    <Image style={styles.logo} source={require("../../assets/logo.png")} />
            <Card style={styles.card}>
                <Card.Title title="LOGAR AO APLICATIVO" />
                <Card.Content >
                    <Text variant="titleMedium"></Text>
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="E-mail"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.label}
                        mode="outlined"
                        label="Senha Acima de 6 caracteres"
                        secureTextEntry
                        maxLength={30}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                </Card.Content>
            </Card>
 
            <TouchableOpacity
                style={[
                    styles.handleLogin,
                    { borderColor: type === "login" ? " #6dbeed" : "black" },
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.loginText}>
                    {type === "login" ? "Acessar" : "Cadastrar"}
                </Text>
            </TouchableOpacity>
 
{loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
            <TouchableOpacity
                onPress={() =>
                    setType((type) => (type === "login" ? "cadastrar" : "login"))
                }
            >
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
                    {type === "login" ? "Criar uma conta?" : "Já possuo uma conta!"}
                </Text>
            </TouchableOpacity>

        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#b8d7e9",
        textAlign: "center",
        padding: 18,
    },
    logo: {
        width: 400,
        height: 400,
        justifyContent: "center",
        alignSelf: "center",
    },
    label: {
        marginBottom: 10,
        color: "red",
    },
    loginText: {
        color: "#FFF",
        fontSize: 24,
    },
    handleLogin: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        height: 45,
        marginTop: 30,
        width: 150,
        borderWidth: 2, // Define a largura da borda
        borderRadius : 5,
    },
    card:{
        backgroundColor : "#b8d7e9", 
    },
});
