import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

    // const [nomeJogo, setNomeJogo] = useState('');
    // const [estudio, setEstudio] = useState('');
    // const [plataforma, setPlataforma] = useState('');
    // const [campoExtra, setCampoExtra] = useState('');
    // const [tags, setTags] = useState([]);
    // const [novaTag, setNovaTag] = useState('');
    // const [error, setError] = useState('');
    // const [fieldError, setFieldError] = useState('');
    // const [tagError, setTagError] = useState(''); 
    // const [key , setKey] = useState('')
             // <Text style={styles.text}>Tags: {data.tags}</Text>


export default function ListJogos({ data, deleteItem, editItem })
{
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nome Jogo: {data.nomeJogo}</Text>
            <Text style={styles.text}>Estudio: {data.estudio}</Text>
            <Text style={styles.text}>Plataforma{data.plataforma}</Text>
            <Text style={styles.text}>Campo Extra: {data.campoExtra}</Text>
                <View style={styles.item}>
                    <TouchableOpacity onPress={() => editItem(data)}>
                        <Icon name="pencil" color="blue" size={20}>Editar</Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteItem(data.key)}>
                        <Icon name="trash-o" color="#A52A2A" size={20}>Excluir</Icon>
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
        backgroundColor: '#D6E2E1',
        paddingTop: 22,
        borderWidth: 0.5,
        borderColor: '#20232a',
        fontWeight: 'bold'
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
    }

});
