import { Text } from "react-native-web";
import { View, StyleSheet, TouchableOpacity, Keyboard, Platform } from "react-native";
import { TextInput, RadioButton, ActivityIndicator , Dialog, Portal, Button} from 'react-native-paper';
import { useEffect, useRef, useState } from "react";
import firebase from '../../services/connectionFirebase.js';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { MaskedTextInput } from 'react-native-mask-text';
import { FlatList } from "react-native";
import ListReports from "../list/listReports.js"

export default function Reportar() {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [bugDescription, setBugDescription] = useState('');
    const [bugDate, setBugDate] = useState('');
    const [severity, setSeverity] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [isPickerFocused, setIsPickerFocused] = useState(false);
    const [isDateFocused, setIsDateFocused] = useState(false);
    const [loading, setLoading] = useState('');
    const [bugs, setBugs] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false); 
    const [deleteKey, setDeleteKey] = useState(''); 
    const [key, setKey] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        async function fetchGames() {
            await firebase.database().ref('jogos').on('value', (snapshot) => {
                const gameList = [];
                snapshot.forEach((child) => {
                    gameList.push({
                        key: child.key,
                        name: child.val().nomeJogo
                    });
                });
                setGames(gameList);
            });
        }
        fetchGames();
    }, []);


    useEffect(() => {
        async function dados() {
            await firebase.database().ref('bugs').on('value', (snapshot) => {
                setBugs([]);
                snapshot.forEach((chilItem) => {
                    let data = {
                        key: chilItem.key,
                        game: chilItem.val().game,
                        description: chilItem.val().description,
                        date: chilItem.val().date,
                        severity: chilItem.val().severity,
                    };
                    setBugs(oldArray => [...oldArray, data].reverse());
                });
                setLoading(false);
            });
        }
        dados();
    }, []);

    const notify = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom',
            visibilityTime: 2000,
        });
    };

    const handleSubmit = async () => {
        if (!selectedGame || !bugDescription.trim() || !bugDate.trim() || !severity.trim()) {
            setFieldError('Todos os campos devem estar preenchidos');
            return;
        }

        setFieldError('');

        if (!isValidDate(bugDate.trim())) {
            setFieldError('Data inválida. Use uma data real no formato DD/MM/AAAA.');
            return;
        }

        const bugRef = firebase.database().ref('bugs');

        if (key) {
            // Atualização
            await bugRef.child(key).update({
                game: selectedGame,
                description: bugDescription,
                date: bugDate,
                severity: severity
            });
            notify("Report de Bug atualizado com sucesso!");
            setKey('');
        } else {
            // Criação
            const bugKey = bugRef.push().key;
            bugRef.child(bugKey).set({
                game: selectedGame,
                description: bugDescription,
                date: bugDate,
                severity: severity
            });
            notify("Bug reportado com sucesso!");
        }

        setSelectedGame('');
        setBugDescription('');
        setBugDate('');
        setSeverity('');
        Keyboard.dismiss();
    };



    const showDeleteDialog = (key) => {
        setDeleteKey(key);
        setDialogVisible(true);
    };


    const hideDeleteDialog = () => {
        setDialogVisible(false);
        setDeleteKey('');
    };


    const handleDelete = (key) => {
        firebase.database().ref('bugs').child(key).remove()
            .then(() => {
                const finbugs = bugs.filter(item => item.key !== key);
                setBugs(finbugs);
                notify('Bug excluído com sucesso!');
            })
            .catch(() => {
                setError('Erro ao excluir o bug.');
            });
        hideDeleteDialog();
    };


    function isValidDate(dateStr) {
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateStr.match(datePattern);
        if (!match) return false;

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        if (month < 1 || month > 12 || year < 1900 || year > 2100) return false;

        const monthDays = [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day >= 1 && day <= monthDays[month - 1];
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    const handleEdit = (data) => {
        console.log('Editando:', data); 
        setKey(data.key);
        setSelectedGame(data.game);         
        setBugDescription(data.description);
        setBugDate(data.date);              
        setSeverity(data.severity);
    };
    function getColorByLevel(level){
        switch (level){
            case 'Crítico':
                return 'red';
            case 'Alto':
                return '#9ea832';
            case 'Médio':
                return 'blue';
            case 'Baixo':
                return '#22f059';
            default:
                return 'gray';
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report o bug encontrado</Text>

            <View style={[
                styles.pickerContainer,
                isPickerFocused && styles.focusedBorder
            ]}>
                <Picker
                    selectedValue={selectedGame}
                    onValueChange={(itemValue) => setSelectedGame(itemValue)}
                    style={styles.picker}
                    onFocus={() => setIsPickerFocused(true)}
                    onBlur={() => setIsPickerFocused(false)}
                >
                    <Picker.Item label="Selecione um jogo" value="" />
                    {games.map((game) => (
                        <Picker.Item key={game.key} label={game.name} value={game.name} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={styles.inputs}
                label="Descrição"
                mode="outlined"
                value={bugDescription}
                onChangeText={setBugDescription}
                numberOfLines={3}
                activeOutlineColor="#22f059"
            />

            <View style={[
                styles.maskedInputWrapper,
                isDateFocused&& {borderColor:'#22f059'},
                !isDateFocused && {borderColor :'#79747e'}
            ]}>
                <MaskedTextInput
                    mask="99/99/9999"
                    placeholder="Data do bug (DD/MM/AAAA)"
                    keyboardType="numeric"
                    value={bugDate}
                    onChangeText={(text) => setBugDate(text)}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => setIsDateFocused(false)}
                    style={styles.maskedInput}
                />
            </View>

            <Text style={{ marginTop: 16, marginBottom: 4, fontSize: 16 }}>Nível de gravidade do bug encontrado</Text>
            <RadioButton.Group
                onValueChange={value => setSeverity(value)}
                value={severity}
            >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {['Crítico', 'Alto', 'Médio', 'Baixo'].map((level) => (
                        <View key={level} style={{ 
                            flexDirection: 'row',
                            alignItems: 'center', 
                            marginRight: 16 ,
                        }}>
                            <RadioButton value={level}
                                color={getColorByLevel(level)}
                                uncheckedColor={getColorByLevel(level)}
                            />
                            <Text style={{color : getColorByLevel(level)}}>{level}</Text>
                        </View>
                    ))}
                </View>
            </RadioButton.Group>

            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}

            <TouchableOpacity
                style={styles.handleSubmit}
                onPress={handleSubmit}
            >
                <Text style={styles.submitText}>
                    Enviar Relatório
                </Text>
            </TouchableOpacity>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja realmente excluir relatorio desse jogo?</Text>
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
                    data={bugs}
                    renderItem={({ item }) => (
                        <ListReports data={item} deleteItem={showDeleteDialog} editItem={handleEdit} />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    inputs: {
        marginTop: 12,
    },
    handleSubmit: {
        marginTop: 30,
        marginBottom: 20,
        alignSelf: 'center',
        backgroundColor: '#22f059',
        borderRadius: 5,
        height: 50,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: "#FFF",
        fontSize: 16,
    },
    errorText: {
        textAlign: "center",
        color: 'red',
        marginTop: 10,
        fontSize: 14,
    },
    pickerContainer: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#79747e',
        borderRadius: 4,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#000',
        fontSize: 16,
        paddingHorizontal: 10,
    },
maskedInputWrapper: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#79747e',
    borderRadius: 4,
    backgroundColor: '#fff',
},
maskedInput: {
    padding: 12,
    fontSize: 16,
    color: '#000',
},
focusedBorder: {
    borderColor: '#22f059',
},

});
