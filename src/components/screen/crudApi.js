import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; 
 
const API_URL = 'https://682b1681ab2b5004cb38ff96.mockapi.io/recorde'; 
 
export default function CrudApi() {
  const [recorde, setRecorde] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [tempo, setTempo] = useState('');
  const [data, setDate] = useState('');
  const [modalidae, setModalidade ] = useState('');
  const [editingRecorde, setEditing] = useState(null);
 
  useEffect(() => {
    buscarRecordes();
  }, []);
 
  const buscarRecordes = async () => {
    try {
      const response = await axios.get(API_URL);
      setRecorde(response.data);
    } catch (error) {
      console.error('Erro ao buscar recordes', error);
      alert('Nenhum recorde foi registrado');
    }
  };
 
  const handleCreate = async () => {
    try {
      const newRecorde = { usuario, tempo, data, modalidae };
      await axios.post(API_URL, newRecorde);
      buscarRecordes();
      setUsuario('');
      setTempo('');
      setDate('');
      setModalidade('');
    } catch (error) {
      console.error('Erro ao registrar recorde', error);
    }
  };
 
  const handleCarregar = (recorde) => {
    setUsuario(recorde.usuario);
    setTempo(recorde.tempo);
    setDate(recorde.data);
    setModalidade(recorde.modalidae);
    setEditing(recorde);
  };
 
  const handleUpdate = async () => {
    try {
      const updatedRecorde = { usuario, tempo, data, modalidae};
      await axios.put(`${API_URL}/${editingRecorde.id}`, updatedRecorde);
      buscarRecordes();
      setUsuario('');
      setTempo('');
      setDate('');
      setModalidade('');
      setEditing(null);
    } catch (error) {
      console.error('Erro ao recorde', error);
    }
  };
 
  const handleDelete = async (recordeId) => {
    try {
      await axios.delete(`${API_URL}/${recordeId}`);
      buscarRecordes();
    } catch (error) {
      console.error('Erro ao deletar recorde', error);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Recordes</Text>
 
      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Usuario"
        style={styles.input}
      />
      <TextInput
        value={tempo}
        onChangeText={setTempo}
        placeholder="Tempo"
        style={styles.input}
       />
       <TextInput
        value={data}
        onChangeText={setDate}
        placeholder="Data"
        style={styles.input}
       />
       <TextInput
        value={modalidae}
        onChangeText={setModalidade}
        placeholder="modalidae"
        style={styles.input}
       />
 
      <Button
        title={editingRecorde? 'Atualizar Recorde' : 'Adicionar Recorde'}
        onPress={editingRecorde? handleUpdate : handleCreate}
        color="#007AFF"
      />
 
      <FlatList
        data={recorde}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordeNome}>{item.usuario}</Text>
              <Text style={styles.recordeTempo}>{item.tempo}</Text>
              <Text style={styles.recordeData}>{item.data}</Text>
              <Text style={styles.recordeMadalidade}>{item.modalidae}</Text>
            </View>
            <TouchableOpacity onPress={() => handleCarregar(item)} style={styles.iconButton}>
              <Icon name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
              <Icon name="trash-2" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#555',
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
});
