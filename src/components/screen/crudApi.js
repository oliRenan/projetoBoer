import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Portal, Dialog, Button as PaperButton } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

const API_URL = 'https://682b1681ab2b5004cb38ff96.mockapi.io/recorde';

export default function CrudApi() {
  const [recorde, setRecorde] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [tempo, setTempo] = useState('');
  const [data, setDate] = useState('');
  const [modalidae, setModalidade] = useState('');
  const [editingRecorde, setEditing] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRecordeId, setSelectedRecordeId] = useState(null);
  const [erros, setErros] = useState({});

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

  const validarCampos = () => {
    const novosErros = {};

    if (!usuario.trim()) novosErros.usuario = 'Usuário é obrigatório.';
    if (!tempo.trim()) {
      novosErros.tempo = 'Tempo é obrigatório.';
    } else if (!/^\d+$/.test(tempo)) {
      novosErros.tempo = 'Tempo deve conter apenas números.';
    }

    if (!data.trim()) {
      novosErros.data = 'Data é obrigatória.';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      novosErros.data = 'Data deve estar no formato DD/MM/AAAA.';
    }

    if (!modalidae.trim()) novosErros.modalidae = 'Modalidade é obrigatória.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const limparCampos = () => {
    setUsuario('');
    setTempo('');
    setDate('');
    setModalidade('');
    setErros({});
    setEditing(null);
  };

  const handleCreate = async () => {
    if (!validarCampos()) return;

    try {
      const newRecorde = { usuario, tempo, data, modalidae };
      await axios.post(API_URL, newRecorde);
      buscarRecordes();
      limparCampos();
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
    if (!validarCampos()) return;

    try {
      const updatedRecorde = { usuario, tempo, data, modalidae };
      await axios.put(`${API_URL}/${editingRecorde.id}`, updatedRecorde);
      buscarRecordes();
      limparCampos();
    } catch (error) {
      console.error('Erro ao atualizar recorde', error);
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

  const showDeleteDialog = (id) => {
    setSelectedRecordeId(id);
    setDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDialogVisible(false);
    setSelectedRecordeId(null);
  };

  const confirmDelete = async () => {
    if (selectedRecordeId !== null) {
      await handleDelete(selectedRecordeId);
      hideDeleteDialog();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Recordes</Text>

      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        label="Usuário"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.usuario}
      />
      {erros.usuario && <Text style={styles.errorText}>{erros.usuario}</Text>}

      <TextInput
        value={tempo}
        onChangeText={setTempo}
        label="Tempo"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        keyboardType="numeric"
        error={!!erros.tempo}
      />
      {erros.tempo && <Text style={styles.errorText}>{erros.tempo}</Text>}

      <TextInput
        value={data}
        onChangeText={setDate}
        label="Data (DD/MM/AAAA)"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.data}
      />
      {erros.data && <Text style={styles.errorText}>{erros.data}</Text>}

      <TextInput
        value={modalidae}
        onChangeText={setModalidade}
        label="Modalidade"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.modalidae}
      />
      {erros.modalidae && <Text style={styles.errorText}>{erros.modalidae}</Text>}

      <TouchableOpacity
        onPress={editingRecorde ? handleUpdate : handleCreate}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>
          {editingRecorde ? 'Atualizar Recorde' : 'Adicionar Recorde'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={recorde}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.gridRow}>
              <Text style={styles.gridText}>{item.usuario}</Text>
              <Text style={styles.gridText}>{item.tempo}</Text>
              <TouchableOpacity onPress={() => handleCarregar(item)} style={styles.iconButton}>
                <Icon name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridText}>{item.data}</Text>
              <Text style={styles.gridText}>{item.modalidae}</Text>
              <TouchableOpacity onPress={() => showDeleteDialog(item.id)} style={styles.iconButton}>
                <Icon name="trash-2" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Diálogo de Confirmação */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir este recorde?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={hideDeleteDialog}>Cancelar</PaperButton>
            <PaperButton onPress={confirmDelete}>Excluir</PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 13,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#22f059',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    padding: 20,
    borderColor: '#79747e',
    paddingTop: 22,
    borderWidth: 0.5,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  gridText: {
    width: '30%',
    fontSize: 16,
    color: 'black',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
});
