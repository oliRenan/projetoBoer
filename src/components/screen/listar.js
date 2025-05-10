import { Text } from "react-native-web"
import ListJogos from '../list/listJogos.js'
import { FlatList, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import firebase from '../../services/connectionFirebase.js';
import { useEffect, useState } from "react";


export default function TelaJogos(){
    const [jogos,setJogos] = useState([]); 
    const [loading,setLoading] = useState(''); 

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

function handleDelete(){

}

function handleEdit(){

}
        return(
          <View style={{ flex: 1, padding: 10 }}>
            <Text>tela de listar</Text>
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
        )
}
