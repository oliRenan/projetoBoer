import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Portal, Dialog, Button as PaperButton } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

const API_URL = 'https://682b1681ab2b5004cb38ff96.mockapi.io/review';

export default function Tela() {
  const [review, setReview] = useState([]);
  const [nomeJogo, setJogo] = useState('');
  const [nota, setnota] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [imagenurl, setImageUrl] = useState('');
  const [editingReview, setEditing] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedReviewId, setSelectReviewId] = useState(null);
  const [erros, setErros] = useState({});

  useEffect(() => {
    buscarReviews();
  }, []);

  const buscarReviews = async () => {
    try {
      const response = await axios.get(API_URL);
      setReview(response.avaliacao);
    } catch (error) {
      console.error('Erro ao buscar reviews', error);
      alert('Nenhum review foi registrado');
    }
  };


const validarCampos = () => {
  const novosErros = {};

  if (!nomeJogo.trim()) {
    novosErros.nomeJogo = 'Nome do jogo é obrigatório.';
  }

  if (!nota.trim()) {
    novosErros.nota = 'Nota é obrigatória.';
  } else if (!/^\d+$/.test(nota)) {
    novosErros.nota = 'Nota deve conter apenas números.';
  }

  if (!avaliacao.trim()) {
    novosErros.avaliacao = 'Avaliação é obrigatória.';
        }

  if (!imagenurl.trim()) {
    novosErros.imagenurl = 'URL da imagem é obrigatória.';
  }

  setErros(novosErros);
  return Object.keys(novosErros).length === 0;
};


  const limparCampos = () => {
    setJogo('');
    setnota('');
    setAvaliacao('');
    setImageUrl('');
    setErros({});
    setEditing(null);
  };

  const handleCreate = async () => {
    if (!validarCampos()) return;

    try {
      const newRecorde = { nomeJogo, nota, avaliacao, imagenurl };
      await axios.post(API_URL, newRecorde);
      buscarReviews();
      limparCampos();
    } catch (error) {
      console.error('Erro ao registrar review', error);
    }
  };

  const handleCarregar = (review) => {
    setJogo(review.nomeJogo);
    setnota(review.nota);
    setAvaliacao(review.avaliacao);
    setImageUrl(review.imagenurl);
    setEditing(review);
  };

  const handleUpdate = async () => {
    if (!validarCampos()) return;

    try {
      const updatedRecorde = { nomeJogo, nota, avaliacao, imagenurl };
      await axios.put(`${API_URL}/${editingReview.id}`, updatedRecorde);
      buscarReviews();
      limparCampos();
    } catch (error) {
      console.error('Erro ao atualizar review', error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${API_URL}/${reviewId}`);
      buscarReviews();
    } catch (error) {
      console.error('Erro ao deletar review', error);
    }
  };

  const showDeleteDialog = (id) => {
    setSelectReviewId(id);
    setDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDialogVisible(false);
    setSelectReviewId(null);
  };

  const confirmDelete = async () => {
    if (selectedReviewId !== null) {
      await handleDelete(selectedReviewId);
      hideDeleteDialog();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Recordes</Text>

      <TextInput
        value={nomeJogo}
        onChangeText={setJogo}
        label="Nome jogo"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.nomeJogo}
      />
    {erros.nomeJogo && <Text style={styles.errorText}>{erros.nomeJogo}</Text>}
      <TextInput
        value={nota}
        onChangeText={setnota}
        label="Nota"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        keyboardType="numeric"
        error={!!erros.nota}
      />
   {erros.nota && <Text style={styles.errorText}>{erros.nota}</Text>}
            <TextInput
        value={avaliacao}
        onChangeText={setAvaliacao}
        label="Avaliacao"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.avaliacao}
      />
      {erros.avaliacao && <Text style={styles.errorText}>{erros.avaliacao}</Text>}
      <TextInput
        value={imagenurl}
        onChangeText={setImageUrl}
        label="Insira a url da imagem"
        style={styles.input}
        activeOutlineColor="#22f059"
        mode="outlined"
        error={!!erros.imagenurl}
      />
     {erros.imagenurl && <Text style={styles.errorText}>{erros.imagenurl}</Text>}
      <TouchableOpacity
        onPress={editingReview ? handleUpdate : handleCreate}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>
          {editingReview ? 'Atualizar Review' : 'Adicionar Review'}
        </Text>
      </TouchableOpacity>

      <FlatList
        review={review}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.gridRow}>
              <Text style={styles.gridText}>{item.nomeJogo}</Text>
              <Text style={styles.gridText}>{item.nota}</Text>
              <TouchableOpacity onPress={() => handleCarregar(item)} style={styles.iconButton}>
                <Icon name="edit" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridText}>{item.avaliacao}</Text>

            <Image
                source={ item.imagenurl} 
                style={{ width: 200, height: 200 }}
                resizeMode="cover" 
            />
              <Text style={styles.gridText}>{item.imagenurl}</Text>
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
            <Text>Tem certeza que deseja excluir este review?</Text>
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
