 import { Text } from "react-native-web";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput , IconButton} from 'react-native-paper';
import { useState } from "react";

export default function Jogos() {
    const [nomeJogo, setNomeJogo] = useState('');
    const [estudio, setEstudio] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [campoExtra, setCampoExtra] = useState('');
    const [tags, setTags] = useState([]);
    const [novaTag, setNovaTag] = useState('');
    const [error, setError] = useState('');

    const handleAddTag = () => {
        if (!novaTag.trim()) {
            setError('A tag não pode ser vazia.');
            return;
        }

        if (tags.includes(novaTag)) {
            setError('Essa tag já foi adicionada.');
            return;
        }

        setTags([...tags, novaTag]);
        setNovaTag('');
        setError(''); 
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSubmit = () => {
        console.log({
            nomeJogo,
            estudio,
            plataforma,
            campoExtra,
            tags
        });
    };

    return (
        <View style={styles.container}>
            <Text>Teste tela jogos</Text>
            <TextInput
                style={styles.inputs}
                label='Nome do jogo'
                right={<TextInput.Icon icon="gamepad-square" />}
                mode="outlined"
                value={nomeJogo}
                onChangeText={setNomeJogo}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label='Estudio'
                right={<TextInput.Icon icon="code-tags" />}
                mode="outlined"
                value={estudio}
                onChangeText={setEstudio}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label='Plataforma'
                right={<TextInput.Icon icon="gamepad-outline" />}
                mode="outlined"
                value={plataforma}
                onChangeText={setPlataforma}
                activeOutlineColor="#22f059"
            />
            <TextInput
                style={styles.inputs}
                label='Geração'
                right={<TextInput.Icon icon="eye" />}
                mode="outlined"
                value={campoExtra}
                onChangeText={setCampoExtra}
                activeOutlineColor="#22f059"
            />
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.inputs, styles.inputTag]}
                    label='Categoria'
                    right={<TextInput.Icon icon="tag" />}
                    mode="outlined"
                    value={novaTag}
                    onChangeText={setNovaTag}
                    onSubmitEditing={handleAddTag} 
                    activeOutlineColor="#22f059"
                />
                 <IconButton
                     icon="plus"
                     size={20}
                     onPress={handleAddTag}
                     style={styles.addButton}
                     iconColor="white"
                 />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                            <Text style={styles.removeTagText}>x</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={styles.handleSubmit}
                onPress={handleSubmit}
            >
                <Text style={styles.loginText}>
                    Dados no console.log
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: "center",
        padding: 18,
    },
    inputs: {
        marginTop: 12,
    },
    inputContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         //marginTop: 12,
         justifyContent: "center",
         alignItems: "baseline",
         gap: 12,
    },
    inputTag: {
        flex: 1, 
    },
    addButton: {
        backgroundColor: '#22f059',
        borderRadius: 5,
        height: 50,
        width: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
        //marginLeft: 10,
         alignItems:"center",
    },
    loginText: {
        color: "#FFF",
        fontSize: 16,
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        padding: 5,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        color: '#333',
    },
    removeTagText: {
        marginLeft: 5,
        color: '#ff0000',
        fontWeight: 'bold',
    },
    errorText: {
         textAlign:"center",
        color: 'red',
        marginTop: 10,
        fontSize: 14,
    },
    handleSubmit: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        marginTop: 30,
        width: 150,
        borderWidth: 2, 
        borderRadius : 5,
        height: 50,
        width:200,
        border:'none',
        backgroundColor:'#22f059',
    },
});
