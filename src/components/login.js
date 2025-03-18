//declaração de componentes a serem utilizados
import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity} from "react-native";
import { Card, Text, TextInput } from "react-native-paper";
import firebase from '../services/connectionFirebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login({changeStatus}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //tipo recebe padrão logado
    const [type, setType] = useState('login');
 
    //verificar se é para logar ou cadastrar
    function handleLogin(){
        if(type === 'login'){
          // Aqui fazemos o login
          const user = firebase.auth().signInWithEmailAndPassword(email, password)
          .then((user) => {
            changeStatus(user.user.uid)
          })
          .catch((err)=>{
            console.log(err);
            alert('E-mail ou senha não cadastrados!');
            return;
          })    
        }else{
         // Aqui cadastramos o usuario
         const user = firebase.auth().createUserWithEmailAndPassword(email, password)
         .then((user)=>{
           changeStatus(user.user.uid)
         })
         .catch((err)=>{
          console.log(err);
            alert('Erro ao Cadastrar!');
          return;
         })
        }
      }    
   
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../../assets/logo.png")} />
            <Card>
                <Card.Title title="LOGAR AO APLICATIVO" />
                <Card.Content>
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
            >
                <Text style={styles.loginText}>
                    {type === "login" ? "Acessar" : "Cadastrar"}
                </Text>
            </TouchableOpacity>
 
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
});