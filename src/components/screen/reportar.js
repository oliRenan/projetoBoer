
import { Text } from "react-native-web";
import { View, StyleSheet, TouchableOpacity, Keyboard, FlatList } from "react-native";
import { TextInput } from 'react-native-paper';
import { useEffect, useState } from "react";
import firebase from '../../services/connectionFirebase.js';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

export default function Reportar() {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [bugDescription, setBugDescription] = useState('');
    const [bugDate, setBugDate] = useState('');
    const [severity, setSeverity] = useState('');
    const [fieldError, setFieldError] = useState('');

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
            setFieldError('All fields are required.');
            return;
        }

        setFieldError('');

        let bugRef = await firebase.database().ref('bugs');
        const bugKey = bugRef.push().key;
        bugRef.child(bugKey).set({
            game: selectedGame,
            description: bugDescription,
            date: bugDate,
            severity: severity
        });

        notify("Bug reported successfully");

        setSelectedGame('');
        setBugDescription('');
        setBugDate('');
        setSeverity('');
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report o bug encontrado</Text>

            <Picker
                selectedValue={selectedGame}
                onValueChange={(itemValue, itemIndex) => setSelectedGame(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a game" value="" />
                {games.map((game) => (
                    <Picker.Item key={game.key} label={game.name} value={game.name} />
                ))}
            </Picker>

            <TextInput
                style={styles.inputs}
                label="Bug description"
                mode="outlined"
                value={bugDescription}
                onChangeText={setBugDescription}
                multiline
                numberOfLines={3}
                activeOutlineColor="#22f059"
            />

            <TextInput
                style={styles.inputs}
                label="Date (e.g., 2025-05-10)"
                mode="outlined"
                value={bugDate}
                onChangeText={setBugDate}
                activeOutlineColor="#22f059"
            />

            <TextInput
                style={styles.inputs}
                label="Severity level"
                placeholder="e.g., Critical, High, Medium, Low"
                mode="outlined"
                value={severity}
                onChangeText={setSeverity}
                activeOutlineColor="#22f059"
            />

            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}

            <TouchableOpacity
                style={styles.handleSubmit}
                onPress={handleSubmit}
            >
                <Text style={styles.submitText}>
                    Submit Report
                </Text>
            </TouchableOpacity>
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
    picker: {
        marginTop: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
});
