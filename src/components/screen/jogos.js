import { Text } from "react-native-web";
import { View, StyleSheet, TouchableOpacity, Keyboard, FlatList } from "react-native";
import { TextInput, IconButton } from 'react-native-paper';
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
    const [key , setKey] = useState('')
    const inputRef = useRef(null);

    const [jogos,setJogos] = useState([]); 
    const [loading,setLoading] = useState(''); 

    const notify = (message) => {
        Toast.show({
            type: 'success', // ou 'success' dependendo do caso
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
        })
        setLoading(false);
      })
    }
    dados();
  }, []);


    function handleDelete(key){
        firebase.database().ref('jogos').child(key).remove()
            .then(() => {
                const findJogos = tarefas.filter(item => item.key !== key)
                setJogos(findJogos)
            })
        alert('Joago Excluída!');
    }

    function handleEdit(data){
        setKey(data.key),
        setNomeJogo(data.nomeJogo),
        setEstudio(data.estudio),
        setPlataforma(data.plataforma),
        setCampoExtra(data.campoExtra),
        setTags(data.tags || []); // Adiciona as tags ao estado
    }

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

        console.log({
            nomeJogo,
            estudio,
            plataforma,
            campoExtra,
            tags
        });


        setFieldError(''); 
        setTagError('');  

        await handleInsert ();
        
        setNomeJogo('')
        setEstudio('')
        setPlataforma('')
        setCampoExtra('')
        setTags([])
    };

    // const handleInsert = async () =>{
    //
    //     // firebase.database().ref('jogos').child(key).update({
    //     //     campoExtra: campoExtra,
    //     //     estudio: estudio,
    //     //     nomeJogo:nomeJogo,
    //     //     plataforma: plataforma,
    //     //     tags:tags
    //     // })
    //     // Keyboard.dismiss();
    //     // alert('Tarefa Editada!');
    //     // setKey('');
    //
    //     let jogosA= await firebase.database().ref('jogos');
    //     const chave = jogosA.push().key;
    //
    //     jogosA.child(chave).set({
    //         campoExtra: campoExtra,
    //         estudio: estudio,
    //         nomeJogo:nomeJogo,
    //         plataforma: plataforma,
    //         tags:tags
    //     });
    //     notify("Jogo cadastrado com sucesso");
    //
    // }
    //

const handleInsert = async () => {
    if (key) {
        // Atualiza um jogo existente
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
        // Cria um novo jogo
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
            <Text>Teste tela jogos</Text>
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

            {/* <View style={styles.tagsContainer}> */}
            {/*     {tags.map((tag, index) => ( */}
            {/*         <View key={index} style={styles.tag}> */}
            {/*             <Text style={styles.tagText}>{tag}</Text> */}
            {/*             <TouchableOpacity onPress={() => handleRemoveTag(tag)}> */}
            {/*                 <Text style={styles.removeTagText}>x</Text> */}
            {/*             </TouchableOpacity> */}
            {/*         </View> */}
            {/*     ))} */}
            {/* </View> */}

            {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                    {editTag === index ? (
                        <>
                            <TextInput
                                style={styles.editTagInput}
                                mode="flat"
                                value={newEditTag}
                                onChangeText={setNewEditTag}
                            />
                            <TouchableOpacity onPress={() => saveEditTag(index)}>
                                <Text style={styles.salvarTagText}>Salvar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (                            <>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => initNewtag(index, tag)}>
                                <Text style={styles.editarTagText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                                <Text style={styles.removeTagText}>x</Text>
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


            {loading ? (
                <ActivityIndicator color="#141414" size={50} />
            ) : (
                <FlatList
                    keyExtractor={item => item.key}
                    data={jogos}
                    renderItem={({ item }) => (
                        <ListJogos data={item} deleteItem={handleDelete} editItem={handleEdit} />
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
        marginBottom:20,
        width: 150,
        borderWidth: 2, 
        borderRadius : 5,
        height: 50,
        width:200,
        backgroundColor:'#22f059',
        border: "none",
    },

    editTagInput: {
        backgroundColor: '#fff',
        padding: 4,
        marginRight: 5,
        minWidth: 100,
    },
    salvarTagText: {
        color: 'green',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    editarTagText: {
        marginLeft: 8,
        color: '#007bff',
    },


});
