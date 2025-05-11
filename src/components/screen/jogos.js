import { Text } from "react-native-web";
import { View, StyleSheet, TouchableOpacity, Keyboard, FlatList, ActivityIndicator } from "react-native";
import { TextInput, IconButton, Dialog, Portal, Button , Icon} from 'react-native-paper';
import { useEffect, useRef, useState } from "react";
import firebase from '../../services/connectionFirebase.js';
import Toast from 'react-native-toast-message';
import ListJogos from "../list/listJogos.js";

export default function Jogos() {
    const [nomeJogo, setNomeJogo] = useState('');
    const [estudio, setEstudio] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [campoExtra, setCampoExtra] = useState('');
    const [tags, setTags] = useState([]);
    const [novaTag, setNovaTag] = useState('');
    const [tagError, setTagError] = useState('');
    const [editTag, setEditTag] = useState(null);
    const [newEditTag, setNewEditTag] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [key, setKey] = useState('');
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false); 
    const [deleteKey, setDeleteKey] = useState(''); 
    const inputRef = useRef(null);

    const notify = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom',
            visibilityTime: 2000,
        });
    };

    useEffect(() => {
        async function dados() {
            await firebase.database().ref('jogos').on('value', (snapshot) => {
                setJogos([]);
                snapshot.forEach((chilItem) => {
                    let data = {
                        key: chilItem.key,
                        nomeJogo: chilItem.val().nomeJogo,
                        estudio: chilItem.val().estudio,
                        plataforma: chilItem.val().plataforma,
                        campoExtra: chilItem.val().campoExtra,
                        tags: chilItem.val().tags,
                    };
                    setJogos(oldArray => [...oldArray, data].reverse());
                });
                setLoading(false);
            });
        }
        dados();
    }, []);

    const showDeleteDialog = (key) => {
        setDeleteKey(key);
        setDialogVisible(true);
    };

    const hideDeleteDialog = () => {
        setDialogVisible(false);
        setDeleteKey('');
    };

    const handleDelete = (key) => {
        firebase.database().ref('jogos').child(key).remove()
            .then(() => {
                const findJogos = jogos.filter(item => item.key !== key);
                setJogos(findJogos);
                notify('Jogo excluído com sucesso!');
            })
            .catch(() => {
                setError('Erro ao excluir o jogo.');
            });
        hideDeleteDialog();
    };

    const handleEdit = (data) => {
        setKey(data.key);
        setNomeJogo(data.nomeJogo);
        setEstudio(data.estudio);
        setPlataforma(data.plataforma);
        setCampoExtra(data.campoExtra);
        setTags(data.tags || []);
    };

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

    const initNewtag = (index, valor) => {
        setEditTag(index);
        setNewEditTag(valor);
    };

    const saveEditTag = (index) => {
        if (!newEditTag.trim()) {
            setError('A tag não pode ficar vazia.');
            return;
        }
        const tagsAtualizadas = [...tags];
        tagsAtualizadas[index] = newEditTag;
        setTags(tagsAtualizadas);
        setEditTag(null);
        setNewEditTag('');
        setError('');
    };

    const handleSubmit = async () => {
        if (!nomeJogo.trim() || !estudio.trim() || !plataforma.trim() || !campoExtra.trim()) {
            setFieldError('Todos os campos são obrigatórios.');
            return;
        }
        if (tags.length === 0) {
            setTagError('Você precisa adicionar pelo menos uma tag.');
            return;
        }
        setFieldError('');
        setTagError('');
        await handleInsert();
        setNomeJogo('');
        setEstudio('');
        setPlataforma('');
        setCampoExtra('');
        setTags([]);
    };

    const handleInsert = async () => {
        if (key) {
            await firebase.database().ref('jogos').child(key).update({
                campoExtra,
                estudio,
                nomeJogo,
                plataforma,
                tags
            });
            notify("Jogo atualizado com sucesso");
            setKey('');
        } else {
            let jogosA = await firebase.database().ref('jogos');
            const chave = jogosA.push().key;
            jogosA.child(chave).set({
                campoExtra,
                estudio,
                nomeJogo,
                plataforma,
                tags
            });
            notify("Jogo cadastrado com sucesso");
        }
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputs}
                label='Nome do jogo'
                right={<TextInput.Icon icon="gamepad-square" />}
                mode="outlined"
                value={nomeJogo}
                onChangeText={setNomeJogo}
                activeOutlineColor="#22f059"
                ref={inputRef}
            />
            <TextInput
                style={styles.inputs}
                label='Estudio'
                right={<TextInput.Icon icon="code-tags" />}
                mode="outlined"
                value={estudio}
                onChangeText={setEstudio}
                activeOutlineColor="#22f059"
                ref={inputRef}
            />
            <TextInput
                style={styles.inputs}
                label='Plataforma'
                right={<TextInput.Icon icon="gamepad-outline" />}
                mode="outlined"
                value={plataforma}
                onChangeText={setPlataforma}
                activeOutlineColor="#22f059"
                ref={inputRef}
            />
            <TextInput
                style={styles.inputs}
                label='Geração'
                right={<TextInput.Icon icon="recycle" />}
                mode="outlined"
                value={campoExtra}
                onChangeText={setCampoExtra}
                activeOutlineColor="#22f059"
                ref={inputRef}
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
                    ref={inputRef}
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
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            {tagError ? <Text style={styles.errorText}>{tagError}</Text> : null}
            {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                    {editTag === index ? (
                        <>
                            <TextInput
                                style={styles.editTagInput}
                                mode="outlined"
                                value={newEditTag}
                                onChangeText={setNewEditTag}
                                activeOutlineColor="#22f059"
                            />
                            <TouchableOpacity onPress={() => saveEditTag(index)}>
                                <Text style={styles.salvarTagText}>Salvar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => initNewtag(index, tag)}>
                                <Text style={styles.editarTagText}><Icon source="note-edit" size={15} /></Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                                <Text style={styles.removeTagText}><Icon source="close-thick" size={15}/></Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ))}
            <TouchableOpacity
                style={styles.handleSubmit}
                onPress={handleSubmit}
            >
                <Text style={styles.loginText}>
                    Cadastrar Jogo
                </Text>
            </TouchableOpacity>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja realmente excluir este jogo?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog}>Cancelar</Button>
                        <Button onPress={() => handleDelete(deleteKey)}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {loading ? (
                <ActivityIndicator color="#141414" size={50} />
            ) : (
                <FlatList
                    keyExtractor={item => item.key}
                    data={jogos}
                    renderItem={({ item }) => (
                        <ListJogos data={item} deleteItem={showDeleteDialog} editItem={handleEdit} />
                    )}
                />
            )}
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
        alignItems: "center",
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
        // backgroundColor: '#fff',
        backgroundColor: 'none',
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
        textAlign: "center",
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
        marginBottom: 20,
        width: 150,
        borderWidth: 2,
        borderRadius: 5,
        height: 50,
        width: 200,
        backgroundColor: '#22f059',
        border: "none",
    },
    editTagInput: {
        backgroundColor: '#fff',
        padding: 2,
        // marginRight: 5,
        height:'35',
    },
    salvarTagText: {
        fontSize:'20',
        color: '#22f059',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    editarTagText: {
        marginLeft: 8,
        color: '#007bff',
    },
});
