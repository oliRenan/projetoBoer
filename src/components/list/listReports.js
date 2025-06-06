
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { text } from 'stream/consumers';

export default function ListReports({ data, deleteItem, editItem })
{
    return (
        <View style={styles.container}>

            <View style={styles.gridRow}>
                <Text style={styles.gridText}>Jogo: {data.game}</Text>
                <Text style={styles.gridText}>Descrição do bug: {data.description}</Text>
                <TouchableOpacity onPress={() => editItem(data)} style={styles.iconButton}>
                    <Icon name="pencil" color="blue" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
                <Text style={styles.gridText}>Data: {data.date}</Text>
                <Text style={styles.gridText}>Seriedade: {data.severity}</Text>
                <TouchableOpacity onPress={() => deleteItem(data.key)} style={styles.iconButton}>
                    <Icon name="trash-o" color="#A52A2A" size={20} />
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
