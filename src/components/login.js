import React, { useState } from "react";
import { View, StyleSheet, Image  } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";

export default function Login({}) {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    //tipo recebe padrão logado

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require("../../assets/tf.png")} />
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

});


