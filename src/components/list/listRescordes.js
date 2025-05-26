import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 
import { text } from 'stream/consumers';

export default function ListRecordes({ item, deleteItem, editItem })
{
    return (
        <View style={styles.container}>

            <View style={styles.gridRow}>
                <Text style={styles.gridText}>Usuario: {item.usuario}</Text>
                <Text style={styles.gridText}>Tempo: {item.tempo}</Text>
                <TouchableOpacity onPress={() => handleCarregar(item)} style={styles.iconButton}>
                    <Icon name="edit" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
                <Text style={styles.gridText}>Data: {item.data}</Text>
                <Text style={styles.gridText}>Modalidae: {item.modalidae}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                    <Icon name="trash-2" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 5,
        padding: 20,
        // backgroundColor: '#D6E2E1',
        borderColor: '#79747e',
        paddingTop: 22,
        borderWidth: 0.5,
        borderRadius : 10,
        fontWeight: 'bold'
    },

    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    gridText: {
        width: '30%',
        fontSize: 16,
        color: 'black',
        text: 'wrap'
    },

    iconButton: {
        width: '30%',
        alignItems: 'flex-end',
    },


    text: {
        color: 'black',
        fontSize: 17
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        fontSize: 18,
        height: 20
    },

    tagsContainer: {
        marginTop: 10,
    },

    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },

    tagItem: {
        backgroundColor: '#b0e0e6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },

    tagText: {
        fontSize: 14,
        color: '#333',
    },

});
