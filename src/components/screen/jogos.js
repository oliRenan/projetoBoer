import { Text } from "react-native-web"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { useState } from "react";


export default function Jogos(){

    const [nomeJogo, setNomeJogo] = useState('');
    const [estudio, setEstudio] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [campoExtra, setCampoExtra] = useState('');
    const [tag, setTag] = useState('');
    //const [novaTag, setNovaTag] = useState('');


    const handleSubmit = () => {
        console.log({
            nomeJogo,
            estudio,
            plataforma,
            campoExtra,
            tag ,
        });
    };

    return(
        <View style={styles.container}>
            <Text>Teste tela jogos</Text>
            <TextInput
                style={styles.inputs}
                label = 'Nome do jogo'
                right={<TextInput.Icon icon="gamepad-squre" />}
                mode="outlined"
                value={nomeJogo}
                onChangeText={setNomeJogo}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label = 'Estudio'
                right={<TextInput.Icon icon="code-tags" />}
                mode="outlined"
                value={estudio}
                onChangeText={setEstudio}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label = 'Plataforma'
                right={<TextInput.Icon icon="gamepad-outline" />}
                mode="outlined"
                value={plataforma}
                onChangeText={setPlataforma}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label = 'Nao sei oque colocar aqui'
                right={<TextInput.Icon icon="eye" />}
                mode="outlined"
                value={campoExtra}
                onChangeText={setCampoExtra}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label = 'teste'
                right={<TextInput.Icon icon="eye" />}
                mode="outlined"
                value={tag}
                onChangeText={setTag}
                activeOutlineColor="#22f059"
            />
            <TouchableOpacity
                style={
                    styles.handleSubmit
                }
                onPress={handleSubmit}
            >
                <Text style={styles.loginText}>
                    Dados no console.log
                </Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "#b8d7e9",
        textAlign: "center",
        padding: 18,
        //alignItems : "center",
        //justifyContent : "center",
    },
    inputs:{
        marginTop: 12,
    },
    loginText: {
        color: "#FFF",
        fontSize: 16,
    },
    handleSubmit: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        marginTop: 30,
        width: 150,
        borderWidth: 2, // Define a largura da borda
        borderRadius : 5,
        height: 50,
        width:200,
        border:'none',
        backgroundColor:'#22f059',
    },
});
