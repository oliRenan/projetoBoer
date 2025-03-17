import React, { useState } from "react";
import { View, StyleSheet, Image , TouchableOpacity } from "react-native";
import { Card, Text, TextInput  } from "react-native-paper";

export default function Login({}) {

    const [email, setEmail] = useState("");
    const [type, setType] = useState("");

    const [password, setPassword] = useState("");

    //tipo recebe padrão logado

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
                    
                    <TouchableOpacity
                        style={[
                            styles.handleLogin,
                            { backgroundColor: type === "login" ? "#3ea6f2" : "black" },
                        ]}
//                        onPress={handleLogin}
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
                </Card.Content>
            </Card>
        </View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "green",

        textAlign: "center",

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
        alignItems: "center",
        justifyContent: "center",
        height: 45,
        marginTop: 30,
    },
});


