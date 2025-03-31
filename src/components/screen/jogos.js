import { Text } from "react-native-web"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, StyleSheet, Image, TouchableOpacity,ActivityIndicator } from "react-native";
import { TextInput } from 'react-native-paper';


export default function Jogos(){
    return(
        <View style={styles.container}>
            <Text>Teste tela jogos</Text>
            <TextInput
                label = 'teste'
                right={<TextInput.Icon icon="eye" />}
                mode="outlined"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#b8d7e9",
        textAlign: "center",
        padding: 18,
    },
});
